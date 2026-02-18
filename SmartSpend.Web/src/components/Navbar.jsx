import { Bell } from 'lucide-react';

function Navbar() {
    return (
        // flex = enables flexbox
        // items-center = vertically centers the icon
        // justify-end = pushes content to the right
        // h-16 = gives the navbar a fixed height
        <div className="w-full h-16 bg-white shadow-sm flex items-center justify-end px-6">
            
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
            </button>
            <img src="https://i.pravatar.cc/40" alt="User Avatar" className="w-8 h-8 rounded-full ml-4" />

        </div>
    );
}

export default Navbar;