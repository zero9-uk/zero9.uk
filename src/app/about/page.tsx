export default function AboutPage() {
  return (
    <div className="pt-[90px] px-6 pb-20 bg-white text-black font-founders max-w-3xl mx-auto space-y-16">
      <section className="space-y-6 text-base leading-relaxed tracking-wide">
        <p>
          ZERO9 is a creative platform, record label, and sound collective founded by James Harcourt in 2025. Rooted in electronic music culture and reaching into the unbounded, ZERO9 represents a spectrum — from the minimal to the infinite.
        </p>
        <p>
           We exist to support the artistic vision of forward-thinking creators through emotionally driven music, visuals, and ideas — with a focus on depth, simplicity, and timelessness, and the connection this can bring to like-minded individuals. We aim to achieve this through a series of carefully curated releases, mixes, and events that reflect these values.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold uppercase tracking-widest mb-4">Subscribe to the newsletter</h2>
			<form 
				action="https://buttondown.com/api/emails/embed-subscribe/zero9.uk"
				method="post"
				target="_blank"
				className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
			  <div className="flex items-center h-[44px] border border-black px-4 w-full sm:w-auto flex-grow">
				  <input
					type="email"
					name="email"
					required
					placeholder="Enter your email"
					className="w-full text-sm bg-transparent text-black placeholder:text-neutral-500 focus:outline-none relative top-[2px]"
				  />
				</div>

			  <button
				type="submit"
				className="h-[44px] px-6 border border-black bg-black text-white uppercase tracking-widest text-sm flex items-center justify-center relative hover:bg-white hover:text-black transition-colors">
				<span className="relative top-[2px]">Subscribe</span>
			  </button>
			</form>
      </section>
    </div>
  );
}
