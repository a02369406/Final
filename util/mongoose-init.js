const mongoose = require("mongoose");
const Trainer = require("../models/trainer-model");
const Course = require("../models/course-model");
const Event = require("../models/event-model");
const Testimonial = require("../models/testimonial-model");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://a02369406_db_user:Rx9Fajbm2cG7rHrI@cluster0.vdo8ykp.mongodb.net/mentor?appName=Cluster0";

const trainerData = [
  {
    name: "Sarah Johnson",
    image: "team-1.jpg",
    expertise: "Web Development",
    bio: "Sarah is a full-stack developer with over 10 years of experience building scalable web applications. She specializes in JavaScript, React, and Node.js."
  },
  {
    name: "Michael Chen",
    image: "team-2.jpg",
    expertise: "Data Science",
    bio: "Michael is a data scientist and machine learning expert. He has worked with Fortune 500 companies to implement AI solutions and predictive analytics."
  },
  {
    name: "Emily Rodriguez",
    image: "team-3.jpg",
    expertise: "Digital Marketing",
    bio: "Emily is a digital marketing strategist with expertise in SEO, content marketing, and social media. She has helped hundreds of businesses grow their online presence."
  },
  {
    name: "David Thompson",
    image: "team-4.jpg",
    expertise: "Cloud Computing",
    bio: "David is a cloud architect certified in AWS, Azure, and GCP. He helps organizations migrate to the cloud and optimize their infrastructure."
  },
  {
    name: "Jessica Williams",
    image: "team-5.jpg",
    expertise: "UI/UX Design",
    bio: "Jessica is a UX designer with a passion for creating intuitive and beautiful user experiences. She has designed interfaces for mobile and web applications."
  },
  {
    name: "Robert Martinez",
    image: "team-6.jpg",
    expertise: "Cybersecurity",
    bio: "Robert is a cybersecurity expert with certifications in ethical hacking and security analysis. He helps organizations protect their digital assets."
  }
];

const eventData = [
  {
    title: "Tech Innovation Summit 2024",
    summary: "Join us for a day of inspiring talks, networking opportunities, and hands-on workshops with industry leaders. Discover the latest trends in technology and innovation.",
    image: "events-item-1.jpg",
    date: new Date("2024-12-15T10:00:00")
  },
  {
    title: "Data Science Workshop",
    summary: "Learn practical data science techniques and tools in this intensive workshop. Perfect for beginners and intermediate practitioners looking to enhance their skills.",
    image: "events-item-2.jpg",
    date: new Date("2024-12-20T14:00:00")
  },
  {
    title: "Web Development Bootcamp",
    summary: "A comprehensive bootcamp covering modern web development technologies. Build real-world projects and learn from experienced developers.",
    image: "events-item-3.jpg",
    date: new Date("2025-01-05T09:00:00")
  },
  {
    title: "Digital Marketing Conference",
    summary: "Explore the latest strategies in digital marketing, social media, and content creation. Network with marketing professionals and learn from case studies.",
    image: "events-item-4.jpg",
    date: new Date("2025-01-12T13:00:00")
  }
];

const testimonialData = [
  {
    name: "John Smith",
    title: "Software Engineer",
    rating: 5,
    testimonial: "The web development course exceeded my expectations. The instructor was knowledgeable and the hands-on projects really helped me understand the concepts.",
    image: "testimonials-1.jpg"
  },
  {
    name: "Maria Garcia",
    title: "Marketing Manager",
    rating: 5,
    testimonial: "I took the digital marketing course and it transformed my career. The practical strategies I learned are directly applicable to my work.",
    image: "testimonials-2.jpg"
  },
  {
    name: "James Wilson",
    title: "Data Analyst",
    rating: 4,
    testimonial: "Great course on data science! The content was well-structured and the examples were relevant to real-world scenarios.",
    image: "testimonials-3.jpg"
  },
  {
    name: "Lisa Anderson",
    title: "Product Designer",
    rating: 5,
    testimonial: "The UI/UX design course was fantastic. I learned so much about user research and design thinking that I've already applied in my projects.",
    image: "testimonials-4.jpg"
  },
  {
    name: "Thomas Brown",
    title: "IT Director",
    rating: 5,
    testimonial: "The cloud computing course provided excellent insights into modern infrastructure. Highly recommend for anyone in IT leadership.",
    image: "testimonials-5.jpg"
  },
  {
    name: "Amanda Taylor",
    title: "Security Specialist",
    rating: 4,
    testimonial: "The cybersecurity course covered all the essential topics. The instructor's real-world experience made the content very valuable.",
    image: "testimonials-6.jpg"
  }
];

async function initializeDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Trainer.deleteMany({});
    await Course.deleteMany({});
    await Event.deleteMany({});
    await Testimonial.deleteMany({});

    console.log("Creating trainers...");
    const trainers = await Trainer.insertMany(trainerData);
    console.log(`Created ${trainers.length} trainers`);

    // Courses will be created by admins through the UI
    console.log("Skipping course creation - courses should be created by admins");

    console.log("Creating events...");
    const events = await Event.insertMany(eventData);
    console.log(`Created ${events.length} events`);

    console.log("Creating testimonials...");
    const testimonials = await Testimonial.insertMany(testimonialData);
    console.log(`Created ${testimonials.length} testimonials`);

    console.log("\nDatabase initialization complete!");
    console.log(`- Trainers: ${trainers.length}`);
    console.log(`- Events: ${events.length}`);
    console.log(`- Testimonials: ${testimonials.length}`);

    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error during database initialization:", err);
    await mongoose.connection.close();
    process.exit(1);
  }
}

initializeDatabase();

