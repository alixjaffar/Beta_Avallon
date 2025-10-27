export function Contact() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
        <div className="max-w-md mx-auto">
          <form className="space-y-4">
            <input 
              type="text" 
              placeholder="Name" 
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full px-4 py-2 border rounded-lg"
            />
            <textarea 
              placeholder="Message" 
              className="w-full px-4 py-2 border rounded-lg h-32"
            />
            <button type="submit" className="btn-primary w-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}