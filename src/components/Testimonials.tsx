import { AnimatedTestimonials } from "@/components/animated-testimonials";

function Testimonials() {
  const testimonials = [
    {
      quote:
        "The exam management system has revolutionized how we handle academic scheduling. It's user-friendly and highly efficient.",
      name: "Dr. Emily Carter",
      designation: "Academic Dean at Elite University",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Implementation was smooth and the system's ability to handle large-scale exams has exceeded our expectations.",
      name: "Michael Johnson",
      designation: "Registrar at Global Academy",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "This system has significantly improved our exam management process. The real-time tracking and reporting features are exceptional.",
      name: "Sarah Williams",
      designation: "Head of Academic Affairs at ScholarNet",
      src: "https://images.unsplash.com/photo-1581093686959-108b3114cc49?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The robust security features and plagiarism detection tools have given us peace of mind during online exams.",
      name: "Kavya Sharma",
      designation: "IT Director at EduTech Institute",
      src: "https://images.unsplash.com/photo-1581092447852-72870d40248b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The system's scalability has been a game-changer for our growing institution. Highly recommended for educational institutions.",
      name: "Dr. Lisa Green",
      designation: "VP of Academic Operations at FutureLearn University",
      src: "https://images.unsplash.com/photo-1573496800808-56566a492b63?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}

export { Testimonials };
