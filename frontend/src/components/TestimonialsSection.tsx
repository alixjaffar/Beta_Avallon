"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

const testimonials = [
  {
    name: "Michael Chen",
    role: "Startup Founder",
    image: "https://avatars.githubusercontent.com/u/1234567?v=4",
    content: "Avallon's AI website builder helped us launch our MVP in days instead of weeks. The automation features and integrated tools have been game-changing for our startup."
  },
  {
    name: "Sarah Johnson",
    role: "Digital Agency Owner",
    image: "https://avatars.githubusercontent.com/u/2345678?v=4",
    content: "The platform's ability to create custom websites and AI agents from one dashboard has transformed how we deliver projects to clients. It's incredibly efficient."
  },
  {
    name: "David Wilson",
    role: "E-commerce Entrepreneur",
    image: "https://avatars.githubusercontent.com/u/3456789?v=4",
    content: "The customer support is exceptional, and having domain, hosting, and email all in one place simplified everything. A game-changer for small business owners."
  },
  {
    name: "Emily Zhang",
    role: "Freelance Developer",
    image: "https://avatars.githubusercontent.com/u/4567890?v=4",
    content: "We've seen remarkable improvements in our project delivery speed since switching to Avallon. The AI agent builder has opened up entirely new possibilities for client automation."
  },
  {
    name: "James Rodriguez",
    role: "Tech Consultant",
    image: "https://avatars.githubusercontent.com/u/5678901?v=4",
    content: "The integrated approach to web creation, automation, and hosting is exactly what the industry needed. Everything just works seamlessly together."
  },
  {
    name: "Lisa Thompson",
    role: "Marketing Director",
    image: "https://avatars.githubusercontent.com/u/6789012?v=4",
    content: "The platform's ability to handle complex websites while maintaining simplicity in the interface is remarkable. It's been invaluable for managing our digital presence."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 overflow-hidden bg-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-normal mb-4">Trusted by Creators</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of satisfied creators building with Avallon
          </p>
        </motion.div>

        <div className="relative flex flex-col antialiased">
          <div className="relative flex overflow-hidden py-4">
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={`${index}-1`} className="w-[400px] shrink-0 glass backdrop-blur-xl border-border hover:border-primary/20 transition-all duration-300 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {testimonial.content}
                  </p>
                </Card>
              ))}
            </div>
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={`${index}-2`} className="w-[400px] shrink-0 glass backdrop-blur-xl border-border hover:border-primary/20 transition-all duration-300 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {testimonial.content}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;