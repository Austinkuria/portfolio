'use client';

import { m } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import { MotionDiv, MotionArticle } from '@/lib/motion';

type BlogPost = {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  slug: string;
};

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Using React Server Components in Next.js',
    description: 'Learn how to leverage React Server Components in Next.js for improved performance and developer experience',
    date: 'May 15, 2023',
    category: 'Frontend',
    image: '/blog/react-server-components.jpg',
    slug: 'using-react-server-components'
  },
  {
    id: 2,
    title: 'Building a Serverless API with TypeScript and AWS Lambda',
    description: 'A comprehensive guide to creating and deploying serverless APIs using TypeScript and AWS Lambda functions',
    date: 'June 2, 2023',
    category: 'Backend',
    image: '/blog/serverless-api.jpg',
    slug: 'serverless-api-typescript-aws'
  },
  {
    id: 3,
    title: 'Optimizing Database Queries for Enhanced Performance',
    description: 'Tips and strategies for writing efficient database queries to improve application performance',
    date: 'July 10, 2023',
    category: 'Database',
    image: '/blog/database-optimization.jpg',
    slug: 'optimizing-database-queries'
  }
];

export default function BlogSection() {
  return (
    <section id="blog" className="py-20 w-full">
      <div className="container mx-auto px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Blog Posts</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on technologies I work with and topics I'm passionate about
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <MotionArticle
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: post.id * 0.1 }}
              className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center text-xs text-muted-foreground mb-3">
                  <FaCalendarAlt className="mr-2" />
                  <span>{post.date}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-muted-foreground mb-4 flex-grow">
                  {post.description}
                </p>
                
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-primary hover:text-primary/80 font-medium inline-flex items-center mt-auto"
                >
                  Read more
                  <FaChevronRight className="ml-1 text-xs" />
                </Link>
              </div>
            </MotionArticle>
          ))}
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link 
            href="/blog"
            className="inline-block border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            View All Posts
          </Link>
        </MotionDiv>
      </div>
    </section>
  );
}
