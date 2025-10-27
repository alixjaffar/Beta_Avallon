import { Metadata } from 'next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';
import { Button } from '@shadcn/ui';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Travel Blog',
  description: 'A blog website for a travel blogger with photo galleries and social links.',
};

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <header className="flex flex-col items-center justify-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Travel Blog</h1>
        <p className="text-gray-500 text-lg">Explore the world through the eyes of a passionate traveler.</p>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Featured Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Render featured blog posts here */}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Render photo gallery here */}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">About the Blogger</h2>
        <div className="flex flex-col md:flex-row items-center">
          <Image src="/profile-image.jpg" alt="Blogger Profile" width={300} height={300} className="rounded-full mb-4 md:mb-0 md:mr-8" />
          <div>
            <h3 className="text-xl font-bold mb-2">Jane Doe</h3>
            <p className="text-gray-500 mb-4">Passionate traveler and storyteller. Exploring the world one adventure at a time.</p>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm">
                Instagram
              </Button>
              <Button variant="outline" size="sm">
                Twitter
              </Button>
              <Button variant="outline" size="sm">
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <Accordion type="single" collapsible className="border-t border-gray-200">
          <AccordionItem value="item-1">
            <AccordionTrigger className="py-4 text-lg font-medium">
              What is the purpose of this blog?
            </AccordionTrigger>
            <AccordionContent className="py-4 text-gray-500">
              This blog is designed to share the travel experiences and adventures of a passionate traveler. The goal is to inspire and inform readers about the wonders of the world.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="py-4 text-lg font-medium">
              How often are new blog posts published?
            </AccordionTrigger>
            <AccordionContent className="py-4 text-gray-500">
              New blog posts are published on a weekly basis, every Friday at 8 AM EST.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="py-4 text-lg font-medium">
              Can I submit my own travel stories?
            </AccordionTrigger>
            <AccordionContent className="py-4 text-gray-500">
              Yes, we welcome guest submissions from fellow travelers. If you have a compelling travel story to share, please contact us at info@travelblog.com.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  );
}
