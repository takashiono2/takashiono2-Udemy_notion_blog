import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/constants";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export const getAllPosts = async () => {
  const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID as string,
    page_size: 100,
    filter:{
      property: "Published",
      checkbox: {
        equals: true,
      }
    },
    sorts: [
      {
      property: "Date",
      direction: "descending"
      }
    ]
  });
  const allPosts = posts.results;

  return allPosts.map((post) => {
    return getPageMetaData(post);
  });
};

const getPageMetaData = (post) => {
  const getTags = (tags) => {
    const allTags = tags.map((tag) => {
      return tag.name
    });
    return allTags;
  }

  return {
    id: post.id,
    title: post.properties.Name.title[0].plain_text,
    description: post.properties.Description.rich_text[0].plain_text,
    date: post.properties.Date.date.start,
    slug: post.properties.Slug.rich_text[0].plain_text,
    tags: getTags(post.properties.Tags.multi_select)
  };
};

export const getSinglePost = async (slug) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID as string,
    filter: {
      property: "Slug",
      formula: {
        string: {
          equals: slug,
        }
      },
    },
  });

  const page = response.results[0];
  const metadata = getPageMetaData(page);
  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdBlocks);
  return {
    metadata,
    markdown: mdString,
  };
};

export const getPostsForTopPage = async (pageSize = 4) => {
  const allPosts = await getAllPosts();
  const fourPosts = allPosts.slice(0, pageSize);
  return fourPosts;
}

export const getPostByPage = async (page: number) => {
  const allPosts = await getAllPosts();
  const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
  const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;
  return allPosts.slice(startIndex, endIndex);
}

export const getNumberOfPages = async () => {
  const allPosts = await getAllPosts();
  return (
    Math.floor(allPosts.length / NUMBER_OF_POSTS_PER_PAGE) + ((allPosts.length % NUMBER_OF_POSTS_PER_PAGE) > 0 ? 1 : 0)
  );
}

export const getPostsByTagAndPage = async ( tagName: string, page: number) => {
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((post)=>
    post.tags.find((tag: string) => tag.toLowerCase() === tagName.toLowerCase())
  );

  const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
  const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;
  return posts.slice(startIndex, endIndex);
}

export const getNumberOfPagesByTag = async(tagName: string)=>{
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((post)=>(
    post.tags.find((tag: string) => tag.toLowerCase() === tagName.toLowerCase())
  ));
  return (
    Math.floor(posts.length / NUMBER_OF_POSTS_PER_PAGE) + ((posts.length % NUMBER_OF_POSTS_PER_PAGE) > 0 ? 1 : 0)
  );
}

export const getAllTags = async()=>{
  const allPosts = await getAllPosts();
  const allTagsDuplcationLists = allPosts.flatMap((post)=>post.tags);
  const set = new Set(allTagsDuplcationLists);
  const allTagList = Array.from(set);
  return allTagList;
}
