import React, { useState } from "react";
import { Layout, Card, Button, Select } from "antd";
import { StoryList } from "./StoryList";
import { StoryDetails } from "./StoryDetails";
import { Story } from "./types";
import { getFilterMenu, storiesDB } from "./data";

const { Option } = Select;
const { Header, Content } = Layout;

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
    setSelectedGenre(value||"All");
  };
  const handleBackToStories = () => {
    setSelectedStory(null);
    setCompletedChapters([]);
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
  const filterOptions =getFilterMenu()

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
              <Select value={selectedGenre} onChange={handleGenreChange} className="w-full"  allowClear onClear={() => {
                setSelectedGenre("All")
              }} defaultValue={selectedGenre||"All"}>
                <Option value="All">All Genres</Option>
                {filterOptions.map(f => <Option key={f} value={f}>{f}</Option>)}
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
