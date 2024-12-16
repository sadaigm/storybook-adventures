import React, { useState } from "react";
import { Layout, Card, Button, Select } from "antd";
import { StoryList } from "./StoryList";
import { StoryDetails } from "./StoryDetails";
import { Story } from "./types";
import { storiesDB } from "./data";

const { Option } = Select;
const { Header, Content } = Layout;

const stories: any[] = [
  {
    title: "Leo and the Storm",
    genre: "Adventure, Friendship, Teamwork, Courage",
    chapters: [
      { title: "The Gathering Clouds", text: "Leo, a young lion, watched dark clouds gather over the jungle." },
      { title: "Asking for Help", text: "Leo ran through the jungle, calling for his friends." },
      { title: "Working Together", text: "Leo, Ellie, and Monty worked together to protect the jungle." },
      { title: "The Storm Passes", text: "When the storm passed, the jungle was calm again." }
    ],
    moral: "Bravery is important, but teamwork makes everything stronger and safer."
  },
  {
    title: "The Brave Little Firefly",
    genre: "Adventure, Friendship, Courage",
    chapters: [
      { title: "A Tiny Spark", text: "Luna, a tiny firefly, lived in a cozy forest." },
      { title: "The Dark Storm", text: "One evening, a storm rolled in. Dark clouds covered the sky." },
      { title: "The Courage to Shine", text: "Luna took a deep breath and shone brighter, pushing through her fear." },
      { title: "The Forest Illuminated", text: "Together, the fireflies lit up the whole forest." }
    ],
    moral: "Even the smallest can make a big difference with courage and teamwork."
  }
];

export const StoryApp: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [completedChapters, setCompletedChapters] = useState<boolean[]>(
    new Array(selectedStory?.chapters.length).fill(false)
  );

  const filterStories = (genre: string) => {
    if (genre === "All") return storiesDB;
    return storiesDB.filter((story) => story.genre.includes(genre));
  };

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
   const stars =  loadStarCollected(story.title)
   console.log({stars})
   if(stars.length != 0){
    setCompletedChapters(stars);
    let c = Math.min(stars.length, story.chapters.length -1 );
    setCurrentChapterIndex( c);
   }
   else{
    setCurrentChapterIndex(0);
   }
    
  };

  const handleNextChapter = () => {
    if (selectedStory && currentChapterIndex < selectedStory.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const handlePreviousChapter = () => {
    if (selectedStory && currentChapterIndex > 0 && currentChapterIndex <= selectedStory.chapters.length - 1) {
        setCurrentChapterIndex(currentChapterIndex - 1);
      }
  }

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
  };
  const handleBackToStories = () => {
    setSelectedStory(null);
  }

  const loadStarCollected = (storyTitle: string) => {
    const storedData = sessionStorage.getItem(`starCollected-${storyTitle}`);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return []; // Default to starting from the first chapter
  };
  const handleCompletedChapters = (storyTitle: string , data: boolean[]) => {
    setCompletedChapters(data);
    sessionStorage.setItem("starCollected-"+storyTitle,JSON.stringify(data));
  }

  return (
    <Layout className="h-full">
      <Header className="bg-blue-500 text-white text-center py-4 text-xl" 
      style={{
        position: "fixed", // Keeps the header fixed
        top: 0,            // Align to the top
        left: 0,           // Align to the left
        right: 0,          // Align to the right
        zIndex: 10,        // Ensure the header stays on top of other elements
      }}
      >
        Storybook Adventures
      </Header>
      <Content className="p-6 h-full mt-16">
        {!selectedStory ? (
          <>
            <div className="mb-4">
              <Select value={selectedGenre} onChange={handleGenreChange} className="w-full" defaultValue="All">
                <Option value="All">All Genres</Option>
                <Option value="Adventure">Adventure</Option>
                <Option value="Friendship">Friendship</Option>
                <Option value="Courage">Courage</Option>
                <Option value="Teamwork">Teamwork</Option>
              </Select>
            </div>
            <StoryList stories={filterStories(selectedGenre)} onStoryClick={handleStoryClick} />
          </>
        ) : (
          <StoryDetails
            story={selectedStory}
            currentChapterIndex={currentChapterIndex}
            onNextChapter={handleNextChapter}
            onPreviousChapter={handlePreviousChapter}
            goBackToStories={handleBackToStories}
            defaultCompletedChapters={completedChapters}
            updateCompletedChapters={handleCompletedChapters}
          />
        )}
      </Content>
    </Layout>
  );
};
