const mongoose = require("mongoose");
const slugify = require("slugify");
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

    const courseData = [
      {
        title: "Complete Web Development Bootcamp",
        image: "course-1.jpg",
        summary: "Master full-stack web development with modern technologies",
        description: "Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and deploy them to production. This comprehensive course covers everything from frontend to backend development.",
        price: 299.99,
        capacity: 50,
        registrants: [],
        schedule: "Monday & Wednesday, 6:00 PM - 8:00 PM",
        likes: 125,
        trainer: trainers[0]._id,
        slug: slugify("Complete Web Development Bootcamp", { lower: true, trim: true })
      },
      {
        title: "Data Science & Machine Learning",
        image: "course-2.jpg",
        summary: "Learn data analysis, visualization, and machine learning",
        description: "Explore Python, pandas, NumPy, scikit-learn, and TensorFlow. Work with real datasets and build machine learning models. Perfect for beginners and intermediate learners.",
        price: 349.99,
        capacity: 40,
        registrants: [],
        schedule: "Tuesday & Thursday, 7:00 PM - 9:00 PM",
        likes: 98,
        trainer: trainers[1]._id,
        slug: slugify("Data Science & Machine Learning", { lower: true, trim: true })
      },
      {
        title: "Digital Marketing Mastery",
        image: "course-3.jpg",
        summary: "Master SEO, social media, and content marketing",
        description: "Learn proven strategies for growing your online presence. Cover SEO optimization, social media marketing, email campaigns, and analytics. Includes hands-on projects.",
        price: 249.99,
        capacity: 60,
        registrants: [],
        schedule: "Saturday, 10:00 AM - 2:00 PM",
        likes: 87,
        trainer: trainers[2]._id,
        slug: slugify("Digital Marketing Mastery", { lower: true, trim: true })
      },
      {
        title: "Cloud Computing Fundamentals",
        image: "course-4.jpg",
        summary: "AWS, Azure, and GCP essentials for cloud professionals",
        description: "Get certified in cloud computing with hands-on labs. Learn infrastructure as code, containerization, serverless computing, and cloud security best practices.",
        price: 399.99,
        capacity: 35,
        registrants: [],
        schedule: "Monday & Friday, 5:00 PM - 7:00 PM",
        likes: 112,
        trainer: trainers[3]._id,
        slug: slugify("Cloud Computing Fundamentals", { lower: true, trim: true })
      },
      {
        title: "UI/UX Design Principles",
        image: "course-5.jpg",
        summary: "Create beautiful and intuitive user interfaces",
        description: "Learn design thinking, user research, wireframing, prototyping, and usability testing. Work with design tools like Figma and Adobe XD. Build a portfolio of projects.",
        price: 279.99,
        capacity: 45,
        registrants: [],
        schedule: "Wednesday & Friday, 6:30 PM - 8:30 PM",
        likes: 76,
        trainer: trainers[4]._id,
        slug: slugify("UI/UX Design Principles", { lower: true, trim: true })
      },
      {
        title: "Cybersecurity Essentials",
        image: "course-6.jpg",
        summary: "Protect systems and networks from cyber threats",
        description: "Learn ethical hacking, network security, cryptography, and incident response. Hands-on labs with real-world scenarios. Prepare for security certifications.",
        price: 329.99,
        capacity: 30,
        registrants: [],
        schedule: "Tuesday & Thursday, 6:00 PM - 8:00 PM",
        likes: 94,
        trainer: trainers[5]._id,
        slug: slugify("Cybersecurity Essentials", { lower: true, trim: true })
      }
    ];

    console.log("Creating courses...");
    const courses = await Course.insertMany(courseData);
    console.log(`Created ${courses.length} courses`);

    console.log("Creating events...");
    const events = await Event.insertMany(eventData);
    console.log(`Created ${events.length} events`);

    console.log("Creating testimonials...");
    const testimonials = await Testimonial.insertMany(testimonialData);
    console.log(`Created ${testimonials.length} testimonials`);

    console.log("\nDatabase initialization complete!");
    console.log(`- Trainers: ${trainers.length}`);
    console.log(`- Courses: ${courses.length}`);
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

