import { getSinglePost } from '@/lib/notionAPI';
import React from 'react';

export const getStaticPaths = async () => {
  return {
    paths: [
      {params: {slug: "first-post"}},
      {params: {slug: "second-post"}},
      {params: {slug: "third-post"}},
    ],
    fallback: "blocking",
  };
};

export const getStaticProps = async ({params}) => {
  const post = await getSinglePost(params.slug);

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 6,
  }
}

const Post = ({post}) => {
  return (
    <section className="container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20">
      <h2 className="w-full text-2xl font-midium">３回目の投稿です。</h2>
      <div className="border-b-2 w-1/3 mt-1 border-sky-900"></div>
      <span className="text-gray-500">
        2023/2/19
      </span>
      <br />
      <p className="text-white bg-sky-900 rounded-xl font-midum mt-2 px-2 inline-block">Next.js</p>
      <div className="mt-10 font-medium">aaaaaaa</div>
    </section>
  )
}

export default Post;
