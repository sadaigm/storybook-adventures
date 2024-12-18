import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Row, Col, Badge, Space } from "antd";
import { Story } from "./types";
import { StarOutlined, StarFilled, HomeTwoTone } from "@ant-design/icons"; // Ant Design Icons for stars 
import CustomImage from "./components/CustomImage";
import { getAppUrl } from "../const";
import NewSpeechPlayer from "./components/NewSpeechPlayer";

interface StoryDetailsProps {
  story: Story;
  currentChapterIndex: number;
  onNextChapter: () => void;
  onPreviousChapter: () => void;
  goBackToStories: () => void;
  defaultCompletedChapters: boolean[];
  updateCompletedChapters: (key: string, a: boolean[]) => void;
}

export const StoryDetails: React.FC<StoryDetailsProps> = ({
  story,
  currentChapterIndex,
  onNextChapter,
  onPreviousChapter,
  goBackToStories,
  defaultCompletedChapters,
  updateCompletedChapters,
}) => {
  const chapter = story.chapters[currentChapterIndex];
  const isLastChapter = currentChapterIndex === story.chapters.length - 1;

  const storyTitleRef = useRef<HTMLDivElement | null>(null);

  // To track completed chapters and show stars
  const [completedChapters, setCompletedChapters] = useState<boolean[]>(defaultCompletedChapters ||
    new Array(story.chapters.length).fill(false)
  );

  // To track if the user has finished the story
  const [isStoryFinished, setIsStoryFinished] = useState(getFinishedStatus(story.title) || false);

  // To track if the moral has been displayed
  const [isMoralVisible, setIsMoralVisible] = useState(false);

  // Mark the current chapter as completed
  const markChapterAsCompleted = () => {
    setCompletedChapters((prev) => {
      const updated = [...prev];
      updated[currentChapterIndex] = true;
      updateCompletedChapters(story.title, updated);
      return updated;
    });
  };
  useEffect(() => {
    if (chapter && storyTitleRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [chapter, isStoryFinished, isMoralVisible, isLastChapter]);

  // Function to handle Finish button click
  const handleFinish = () => {
    setIsMoralVisible(false);
    setIsStoryFinished(true); // Mark the story as finished
    sessionStorage.setItem("finished-" + story.title, "true");
  };

  const readAgain = () => {
    setIsStoryFinished(false);
    sessionStorage.removeItem("finished-" + story.title);
  };

  return (
    <div ref={storyTitleRef} className="max-w-full mx-auto min-h-screen flex flex-col">
      {/* Progress Card */}
      <Card className="mb-8">
        <Row justify="space-between" align="middle">
          <Col>
            <h3 className="text-xl font-semibold text-gray-800">
              Progress: Chapter {currentChapterIndex + 1} of{" "}
              {story.chapters.length}
            </h3>
          </Col>
          <Col>
            <div className="flex space-x-2">
              {story.chapters.map((_, index) => (
                <span key={index}>
                  {completedChapters[index] ? (
                    <StarFilled style={{ color: "gold", fontSize: "36px" }} />
                  ) : (
                    <StarOutlined style={{ color: "gray", fontSize: "36px" }} />
                  )}
                </span>
              ))}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Moral Section for Last Chapter (will be shown after Next button click) */}
      {isMoralVisible && (
        <Card className="mb-8">
          <div className="flex justify-between p-8 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 rounded-lg shadow-xl text-center text-white">
            {/* Moral */}
            <div className="w-2/3">
              <h3 className="font-extrabold text-3xl mb-4">
                Moral of the Story:
              </h3>
              <p className="text-2xl italic">{story.moral}</p>
            </div>
            {/* Finish Button */}
            <div className="w-1/3 flex justify-center items-center">
              <Button
                type="primary"
                onClick={handleFinish}
                className="w-auto lg:w-full"
              >
                Finish
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card
        title={
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold" style={{ width: "auto", overflowX: "hidden", textOverflow: "ellipsis" }}>
              {story.title}
            </span>
            <Space style={{ minWidth: '75px' }} >
              {currentChapterIndex > 0 && !isMoralVisible && !isStoryFinished && (
                <Button
                  key="previous"
                  type="default"
                  onClick={onPreviousChapter}
                  className="w-full md:w-auto hidden lg:block"
                >
                  Previous
                </Button>
              )}
              {!isMoralVisible && !isStoryFinished && (
                <Button
                  key="next"
                  type="primary"
                  onClick={() => {
                    markChapterAsCompleted();
                    if (isLastChapter) {
                      setIsMoralVisible(true); // Show moral after last chapter
                    }
                    onNextChapter();
                  }}
                  className="w-full md:w-auto hidden lg:block"
                >
                  Next
                </Button>
              )}
              <Button
                type="default"
                onClick={goBackToStories}
                className="text-blue-500 hover:text-blue-700 w-auto lg:w-full"
                icon={<HomeTwoTone style={{ fontSize: "24px" }} />}
              >
                <p className="hidden lg:block">All Stories</p>
              </Button>
            </Space>
          </div>
        }
        className="mb-8"
        actions={[
          currentChapterIndex > 0 && !isMoralVisible && !isStoryFinished && (
            <Button
              key="previous"
              type="default"
              onClick={onPreviousChapter}
              className="w-auto lg:w-full lg:hidden"
            >
              Previous
            </Button>
          ),

          !isMoralVisible && !isStoryFinished && (
            <Button
              key="next"
              type="primary"
              onClick={() => {
                markChapterAsCompleted();
                if (isLastChapter) {
                  setIsMoralVisible(true); // Show moral after last chapter
                }
                onNextChapter();
              }}
              className="w-auto lg:w-full lg:hidden"
            >
              Next
            </Button>
          ),
        ]}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Section */}
          <div className="flex-1 md:w-1/3 p-2">
            <CustomImage
              src={`${getAppUrl()}/${story.title}.jpeg`} // Ensure the correct path
              alt={story.title}
              className="rounded-lg w-full h-auto object-cover mt-6 h-full"
              title={story.title}
            />
          </div>

          {/* Text Section */}
          <div className="flex-1 md:w-2/3 p-2">
            {!isStoryFinished && (
               <NewSpeechPlayer text={chapter.text} />
            )}

            {/* Congratulatory Message with Gold Badge */}
            {isStoryFinished && (
              <div className="mt-6 p-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-lg shadow-xl text-center text-white flex flex-col justify-center items-center h-full">
                <h3 className="font-extrabold text-3xl mb-4">Congratulations!</h3>
                <Badge count="🎉" style={{ backgroundColor: "gold", fontSize: "2rem" }} />
                <p className="text-2xl mt-4">You have completed the story! 🎉</p>
                <Button
                  type="primary"
                  onClick={goBackToStories}
                  className="mt-4 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-700 hover:to-pink-700 shadow-lg transform transition-all hover:scale-105"
                >
                  OK, Go Back to List
                </Button>
                <Button
                  type="primary"
                  onClick={readAgain}
                  className="mt-4 text-white bg-gradient-to-r from-indigo-500 via-blue-700 to-green-500 hover:from-indigo-700 hover:to-pink-700 shadow-lg transform transition-all hover:scale-105"
                >
                  Read Again
                </Button>
              </div>
            )}

            {!isStoryFinished && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{chapter.title}</h3>
                <p className="text-lg leading-relaxed text-gray-700">{chapter.text}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );

  function getFinishedStatus(title: string): boolean {
    const sData = sessionStorage.getItem("finished-" + title);
    if (sData) {
      return JSON.parse(sData);
    }
    return false;
  }
};
