export default function Button({ text, onClick }: { text: string; onClick?: () => void }) {
    return (
      <button
        onClick={onClick}
        className=" mt-2 w-52 px-6 py-2 bg-blue-500 hover:cursor-pointer text-white rounded-lg shadow-[0px_-4px_8px_rgba(255,255,255,0.2)] border border-white/20 
        hover:bg-white hover:text-black hover:shadow-lg transition-all duration-300"
      >
        {text}
      </button>
    );
  }
  