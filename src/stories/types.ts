export interface Chapter {
    title: string;
    chapter: number;
    text: string;
  }
  
  export interface Story {
    title: string;
    genre: string;
    chapters: Chapter[];
    moral: string;
  }
  