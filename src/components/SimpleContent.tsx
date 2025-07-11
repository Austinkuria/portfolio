export default function SimpleContent() {
  return (
    <div className="w-full py-20">
      <div className="max-w-6xl mx-auto px-4">
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
            I'm a passionate full-stack developer with expertise in modern web technologies. 
            I love building scalable applications that solve real-world problems.
          </p>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-2">Project 1</h3>
              <p className="text-muted-foreground">A description of your project here.</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-2">Project 2</h3>
              <p className="text-muted-foreground">A description of your project here.</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-2">Project 3</h3>
              <p className="text-muted-foreground">A description of your project here.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">React</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Next.js</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">TypeScript</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Node.js</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Python</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Django</span>
          </div>
        </section>
      </div>
    </div>
  );
}
