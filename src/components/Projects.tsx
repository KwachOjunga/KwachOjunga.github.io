export default function Projects() {
  const projects = [
    {
      title: "Sudan Human Rights Hub",
      description: "A comprehensive content management system and website for Sudan Human Rights Hub, featuring news management, document archives, and advocacy resources with robust DevOps infrastructure.",
      tech: ["TypeScript", "DevOps", "CMS", "Next.js"],
      link: "https://sudanhrh.org/",
      featured: true
    },
    {
      title: "University of Dar es Salaam Timetabling System",
      description: "A comprehensive web application for managing and displaying the University of Dar es Salaam's timetables, streamlining academic scheduling for students and faculty.",
      tech: ["React", "Node.js", "MongoDB", "Express.js"],
      link: "https://timetable.udsm.ac.tz",
      featured: true
    },
    {
      title: "Tanzania Job Opportunities Platform",
      description: "A modern job board platform connecting job seekers with employers across Tanzania, featuring advanced search, application tracking, and company profiles.",
      tech: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
      link: "https://t-hustle.com",
      featured: true
    },
    {
      title: "Seede XR - Co-founded Company",
      description: "Co-founded boutique design studio specializing in AR/VR, 3D design, and AI-generated art. Creating immersive experiences and solving African socio-economic problems through technology, including health training simulations and interactive digital experiences.",
      tech: ["AR/VR", "3D Design", "Unity", "AI Art"],
      link: "https://www.linkedin.com/company/seede-xr",
      featured: true
    },
    {
      title: "Telmon - Telnet Monitoring Tool",
      description: "A network monitoring utility for tracking Telnet connections, providing real-time insights into network connectivity and performance metrics.",
      tech: ["Python", "Networking", "CLI Tools"],
      link: "https://github.com/jackkweyunga/telmon",
      featured: false
    },
    {
      title: "Django Login/Logout Starter",
      description: "A Django template project with pre-configured authentication system, helping developers quickly bootstrap secure web applications.",
      tech: ["Django", "Python", "Bootstrap", "SQLite"],
      link: "https://github.com/jackkweyunga/django-login-logout-starter",
      featured: false
    },
    {
      title: "Electronics Projects Collection",
      description: "A curated collection of Arduino and embedded systems projects, featuring various sensors, actuators, and IoT implementations.",
      tech: ["Arduino", "C++", "IoT", "Sensors"],
      link: "https://github.com/jackkweyunga/electronics-projects-collection",
      featured: false
    },
    {
      title: "Docker Setup Collection",
      description: "A comprehensive repository of Docker configurations and setups for various development environments and deployment scenarios, streamlining containerization workflows.",
      tech: ["Docker", "DevOps", "Containerization", "CI/CD"],
      link: "https://github.com/jackkweyunga/docker-setup",
      featured: false
    }
  ];

  return (
    <section id="projects" className="py-20 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight">
          Featured Projects
        </h2>
        <p className="text-xl text-secondary max-w-2xl mx-auto">
          A selection of projects showcasing my expertise in full-stack development,
          DevOps practices, and modern web technologies
        </p>
      </div>
      
      <div className="space-y-12">
        {projects.map((project, index) => (
          <div
            key={index}
            className="py-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              {project.featured && (
                <span className="px-3 py-1 border border-primary/30 text-primary text-xs font-medium rounded-full">
                  Featured
                </span>
              )}
            </div>
            
            <p className="text-secondary mb-4 leading-relaxed">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-3 mb-4 text-sm text-secondary">
              {project.tech.map((tech, techIndex) => (
                <span key={techIndex}>
                  {tech}
                  {techIndex < project.tech.length - 1 && <span className="ml-3">•</span>}
                </span>
              ))}
            </div>
            
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              View Project
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}