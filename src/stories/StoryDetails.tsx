import React, { useState } from "react";
import { Button, Card, Row, Col, Badge, Space } from "antd";
import { Story } from "./types";
import { StarOutlined, StarFilled } from "@ant-design/icons"; // Ant Design Icons for stars
import CustomImage from "./components/CustomImage";
import { getAppUrl } from "../const";

interface StoryDetailsProps {
  story: Story;
  currentChapterIndex: number;
  onNextChapter: () => void;
  onPreviousChapter: () => void;
  goBackToStories: () => void;
}

export const StoryDetails: React.FC<StoryDetailsProps> = ({
  story,
  currentChapterIndex,
  onNextChapter,
  onPreviousChapter,
  goBackToStories,
}) => {
  const chapter = story.chapters[currentChapterIndex];
  const isLastChapter = currentChapterIndex === story.chapters.length - 1;

  // To track completed chapters and show stars
  const [completedChapters, setCompletedChapters] = useState<boolean[]>(
    new Array(story.chapters.length).fill(false)
  );

  // To track if the user has finished the story
  const [isStoryFinished, setIsStoryFinished] = useState(false);

  // To track if the moral has been displayed
  const [isMoralVisible, setIsMoralVisible] = useState(false);

  // Mark the current chapter as completed
  const markChapterAsCompleted = () => {
    setCompletedChapters((prev) => {
      const updated = [...prev];
      updated[currentChapterIndex] = true;
      return updated;
    });
  };

  // Function to handle Finish button click
  const handleFinish = () => {
    setIsMoralVisible(false);
    setIsStoryFinished(true); // Mark the story as finished
  };

  return (
    <div className="max-w-full mx-auto min-h-screen flex flex-col">
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
                    // Increase the size of the filled star
                    <StarFilled style={{ color: "gold", fontSize: "36px" }} />
                  ) : (
                    // Increase the size of the outlined star
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
                className="w-full md:w-auto"
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
            <span className="text-xl font-bold">{story.title}</span>
            <Space>
              {
                // Previous Button (only shown if not on the first chapter)
                currentChapterIndex > 0 &&
                  !isMoralVisible &&
                  !isStoryFinished && (
                    <Button
                      key="previous"
                      type="default"
                      onClick={onPreviousChapter}
                      className="w-full md:w-auto"
                    >
                      Previous Chapter
                    </Button>
                  )
              }
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
                  className="w-full md:w-auto"
                >
                  Next Chapter
                </Button>
              )}
              <Button
                type="default"
                onClick={goBackToStories}
                className="text-blue-500 hover:text-blue-700"
              >
                All Stories
              </Button>
            </Space>
          </div>
        }
        className="mb-8"
        actions={[
          // Previous Button (only shown if not on the first chapter)
          currentChapterIndex > 0 && !isMoralVisible && !isStoryFinished && (
            <Button
              key="previous"
              type="default"
              onClick={onPreviousChapter}
              className="w-full md:w-auto"
            >
              Previous Chapter
            </Button>
          ),

          // Next Button (showed on all chapters except the last one)
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
              className="w-full md:w-auto"
            >
              Next Chapter
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
            {/* Congratulatory Message with Gold Badge */}
            {isStoryFinished && (
              <div className="mt-6 p-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-lg shadow-xl text-center text-white flex flex-col justify-center items-center h-full">
                <h3 className="font-extrabold text-3xl mb-4">
                  Congratulations!
                </h3>
                <Badge
                  count="🎉"
                  style={{ backgroundColor: "gold", fontSize: "2rem" }}
                />
                <p className="text-2xl mt-4">
                  You have completed the story! 🎉
                </p>
                {/* OK Button with styling */}
                <Button
                  type="primary"
                  onClick={goBackToStories}
                  className="mt-4 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-700 hover:to-pink-700 shadow-lg transform transition-all hover:scale-105"
                  style={{
                    padding: "12px 24px",
                    fontSize: "16px",
                    borderRadius: "9999px",
                    fontWeight: "bold",
                  }}
                >
                  OK, Go Back to List
                </Button>
              </div>
            )}
            {!isStoryFinished && (
              <>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {chapter.title}
                </h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  {chapter.text}
                </p>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
