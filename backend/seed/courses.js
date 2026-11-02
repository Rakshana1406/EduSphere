const courses = [
    {
      "id": "1",
      "courseName": "Python Programming",
      "courseCode": "CS101",
      "instructor": "Dr. Anu",
      "duration": "8 Weeks",
      "level": "Beginner",
      "category": "Programming",
      "image": "https://cdn-icons-png.flaticon.com/512/5968/5968350.png",
      "status": "Active",
      "overview": "Learn Python programming from beginner to advanced level.",
      "learningOutcomes": [
        "Understand Python basics",
        "Work with functions",
        "Use object-oriented programming",
        "Build Python applications"
      ],
      "modules": [
        { "title": "Python Basics & Control Flow", "videoUrl": "https://www.youtube.com/watch?v=kqtD5dpn9C8" },
        { "title": "Functions & Object-Oriented Programming", "videoUrl": "https://www.youtube.com/watch?v=_uQrJ0TkZlc" },
        { "title": "Mini Project", "videoUrl": "https://www.youtube.com/watch?v=_uQrJ0TkZlc" }
      ]
    },
    {
      "id": "2",
      "courseName": "Web Development",
      "courseCode": "WD101",
      "instructor": "Dr. Priya",
      "duration": "10 Weeks",
      "level": "Intermediate",
      "category": "Web Development",
      "image": "https://cdn-icons-png.flaticon.com/512/1006/1006363.png",
      "status": "Active",
      "overview": "Learn HTML, CSS and JavaScript for modern web development.",
      "learningOutcomes": [
        "Create semantic HTML",
        "Design responsive websites",
        "Use JavaScript",
        "Work with APIs"
      ],
      "modules": [
        { "title": "HTML & CSS Fundamentals", "videoUrl": "https://www.youtube.com/watch?v=qz0aGYrrlhU" },
        { "title": "JavaScript & the DOM", "videoUrl": "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
        { "title": "Working with REST APIs", "videoUrl": "https://www.youtube.com/watch?v=W6NZfCO5SIk" }
      ]
    },
    {
      "id": "3",
      "courseName": "Artificial Intelligence",
      "courseCode": "AI101",
      "instructor": "Dr. Priya",
      "duration": "12 Weeks",
      "level": "Advanced",
      "category": "Artificial Intelligence",
      "image": "https://cdn-icons-png.flaticon.com/512/4712/4712027.png",
      "status": "Active",
      "overview": "Learn the fundamentals of Artificial Intelligence.",
      "learningOutcomes": [
        "Understand AI concepts",
        "Explore machine learning",
        "Understand neural networks",
        "Build AI applications"
      ],
      "modules": [
        { "title": "Introduction to AI", "videoUrl": "" },
        { "title": "Machine Learning & Neural Networks", "videoUrl": "" },
        { "title": "Generative AI & AI Project", "videoUrl": "" }
      ]
    }
  ];

module.exports = courses;