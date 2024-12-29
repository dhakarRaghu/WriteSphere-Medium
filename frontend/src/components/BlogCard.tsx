export const BlogCard = () => {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
                className="w-full h-56 object-cover object-center"
                src="https://images.unsplash.com/photo-1593642632822-1d5b9b3d5c7e"
                alt="blog"
            />
            <div className="p-4">
                <h2 className="font-semibold text-lg text-gray-800">Blog Title</h2>
                <p className="text-gray-600 mt-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos eligendi, in laborum, voluptate id, aspernatur.</p>
                <div className="flex justify-between items-center mt-4">
                    <a href="#" className="text-blue-600 hover:underline">Read more</a>
                    <div>
                        <a href="#" className="flex items-center">
                            <img
                                className="mx-4 w-10 h-10 object-cover object-center rounded-full"
                                src="https://images.unsplash.com/photo-1593642632822-1d5b9b3d5c7e"
                                alt="avatar"
                            />
                            <h1 className="text-gray-700 font-semibold">John Doe</h1>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}