import React from "react";
import { Card, Button } from "antd";
import { Story } from "./types";
import CustomImage from "./components/CustomImage";

interface StoryListProps {
  stories: Story[];
  onStoryClick: (story: Story) => void;
}

export const StoryList: React.FC<StoryListProps> = ({ stories, onStoryClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stories.map((story) => (
        <Card
          key={story.title}
          hoverable
          cover={<CustomImage alt={story.title}  src={window.location.origin+"/" + (story.title+".jpeg")}  title={story.title} />}
          onClick={() => onStoryClick(story)}
          className="cursor-pointer"
        >
          <Card.Meta title={story.title} description={story.genre} />
        </Card>
      ))}
    </div>
  );
};
