import { NotebookText, NotebookPen, Plus, LogOut, Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Input from "../components/Input";
import { crudStore } from "../store/crudstore.jsx";
import { toast } from "react-hot-toast";
import { authStore } from "../store/authStore.jsx";

function Home() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    // temp
    const [tempid, setTempId] = useState("");
    const [temptitle, setTempTitle] = useState("");
    const [tempdescription, setTempDescription] = useState("");
    const [tempimageLink, setTempImageLink] = useState("");
    const [tempFile, setTempFile] = useState("");

    // const [imageLink, setImageLink] = useState("");

    // to intentionally call the modals
    const ModelRef = useRef(null);
    const ModelRef1 = useRef(null);

    // fetched data
    const [fetchedData, setFetchedhData] = useState([]);

    // variables and functions from store
    const { addData, fetchData, deleteData, updateData, error, isLoading } = crudStore();
    const { logout, user } = authStore();

    useEffect(() => {
        fetchDataFromStore();
    }, [fetchData]);

    // methods
    const openModal = (x) => {
        x.current.showModal();
    };

    const closeModel = (x) => {
        x.current.close();
    };

    // to convert a file to base64 formatted url
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const fetchDataFromStore = async () => {
        try {
            const response = await fetchData(user.email);
            if (response.message === "No data found") {
                toast.success("No data Found");
                setFetchedhData([]);
            } else {
                setFetchedhData(response);
            }
        } catch (error) {
            toast.error("Failed to fetch data. Try again!");
        }
    };

    // to fill data in modal input fields after clicking edit button
    const fillData = (id, title, description, imageLink) => {
        setTempId(id);
        setTempTitle(title);
        setTempImageLink(imageLink);
        // setTempFile(file);
        setTempDescription(description);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // base4 format
            // await addData(title, description, imageLink, user.email);

            // upload files with multer+cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("email", user.email);
            await addData(formData);

            setTitle("");
            setDescription("");
            setFile(null);
            // setImageLink("");

            closeModel(ModelRef);
            toast.success("Data added successfully!");
            const response = await fetchData(user.email);
            setFetchedhData(response);
        } catch (error) {
            // closeModel(ModelRef);
            if (error.response.status == 401) {
                toast.error("You need to login");
            } else {
                toast.error("Failed to add data. Try again!");
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteData(id);
            toast.success("Data deleted successfully!");
            const updatedData = fetchedData.filter((item) => item.id !== id);
            setFetchedhData(updatedData);
        } catch (error) {
            if (error.response.status == 401) {
                toast.error("You need to login");
            } else {
                toast.error("Failed to add data. Try again!");
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("file", tempFile);
            formData.append("title", temptitle);
            formData.append("description", tempdescription);
            formData.append("id", tempid);

            await updateData(formData);
            setTempId("");
            setTempTitle("");
            setTempFile(null);
            setTempImageLink("");
            setTempDescription("");
            closeModel(ModelRef1);
            toast.success("Data deleted successfully!");
        } catch (error) {
            // closeModel(ModelRef1);
            if (error.response.status == 401) {
                toast.error("You need to login");
            } else {
                toast.error("Failed to add data. Try again!");
            }
        }
    };

    // base64 url generating
    const handleFileUpload = async (e, x) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Please select a file to upload.");
            return;
        }
        try {
            const base64 = await convertToBase64(file);
            x(base64);
        } catch (error) {
            toast.error("Failed to upload file. Please try again.");
        }
    };

    const handleEditButtonClick = (data) => {
        fillData(data.id, data.title, data.description, data.imagelink);
        openModal(ModelRef1);
    };

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
    };

    return (
        <div className="w-full flex flex-col">
            <div className="flex justify-end">
                {}
                <button className="btn btn-warning" onClick={handleLogout}>
                    Logout <LogOut />
                </button>
            </div>
            <div className="w-full min-h-[600px] mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-100 to-cyan-200 text-transparent bg-clip-text">
                    Dashboard
                </h2>

                <div className="flex justify-end">
                    <button
                        onClick={() => openModal(ModelRef)}
                        className="flex items-center py-2 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        <Plus /> Add New
                    </button>
                    <dialog id="addModal" className="modal" ref={ModelRef}>
                        <div className="modal-box">
                            <h3 className="text-3xl text-center font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
                                Add Data
                            </h3>
                            <div className="p-8">
                                <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                                    <Input
                                        icon={NotebookPen}
                                        type="text"
                                        placeholder="Title"
                                        value={title || " "}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                        }}
                                    />
                                    <Input
                                        icon={NotebookText}
                                        type="text"
                                        placeholder="Description"
                                        value={description || " "}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                        }}
                                    />
                                    <input
                                        type="file"
                                        className="border-gray-700 mb-6 file-input w-full bg-opacity-50 rounded-lg border focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500 transition-duration-200"
                                        name="file"
                                        accept=".jpeg, .png, .jpg"
                                        onChange={(e) => {
                                            setFile(e.target.files[0]);
                                            // handleFileUpload(e, setImageLink);
                                        }}
                                    />
                                    {error && <p className="text-red-500 font-semibold mb-4 text-center">{error}</p>}
                                    <button
                                        type="submit"
                                        className="w-full py-2 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    >
                                        {isLoading ? <Loader className="size-4 mx-auto animate-spin" /> : "Submit"}
                                    </button>
                                </form>
                            </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                </div>
                <div className="p-4">
                    <div className="flex flex-wrap justify-evenly gap-6 text-center">
                        {fetchedData.length > 0 ? (
                            fetchedData.map((data, index) => (
                                <div
                                    className="card bg-cyan-400 w-full sm:w-80 md:w-72 lg:w-96 xl:w-96 shadow-xl"
                                    key={index}
                                >
                                    <figure>
                                        <img
                                            className="w-full h-48 object-cover"
                                            src={
                                                data.imagelink ||
                                                "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                            }
                                            alt={data.title || "Image"}
                                        />
                                    </figure>
                                    <div className="card-body p-4">
                                        <h2 className="card-title text-xl font-semibold text-blue-100">{data.title}</h2>
                                        <p className="text-sm text-ellipsis overflow-hidden whitespace-nowrap">
                                            {data.description}
                                        </p>
                                        <div className="card-actions flex items-center justify-end gap-2">
                                            <button
                                                className="btn btn-error text-white"
                                                onClick={() => handleDelete(data.id)}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="btn btn-primary text-white font-bold border border-gray-600 shadow-md"
                                                onClick={() => handleEditButtonClick(data)}
                                            >
                                                Edit
                                            </button>
                                            <dialog className="modal" ref={ModelRef1}>
                                                <div className="modal-box">
                                                    <h3 className="text-3xl text-center font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
                                                        Edit Data
                                                    </h3>
                                                    <div className="p-8">
                                                        <form onSubmit={handleUpdate} encType="multipart/form-data">
                                                            <Input
                                                                icon={NotebookPen}
                                                                type="text"
                                                                placeholder="Title"
                                                                value={temptitle}
                                                                onChange={(e) => setTempTitle(e.target.value)}
                                                            />
                                                            <Input
                                                                icon={NotebookText}
                                                                type="text"
                                                                placeholder="Description"
                                                                value={tempdescription}
                                                                onChange={(e) => setTempDescription(e.target.value)}
                                                            />
                                                            <figure>
                                                                <img
                                                                    className="w-full h-48 object-cover rounded-t-md"
                                                                    src={
                                                                        tempimageLink ||
                                                                        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                                                    }
                                                                    alt={temptitle || "Image"}
                                                                />
                                                            </figure>
                                                            <input
                                                                type="file"
                                                                className="border-gray-700 mb-6 file-input w-full bg-opacity-50 rounded-md border focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500 transition-duration-200"
                                                                accept=".jpeg, .png, .jpg"
                                                                onChange={(e) => {
                                                                    //   handleFileUpload(e, setTempImageLink)
                                                                    setTempFile(e.target.files[0]);
                                                                    handleFileUpload(e, setTempImageLink);
                                                                }}
                                                            />
                                                            {error && (
                                                                <p className="text-red-500 font-semibold mb-4 text-center">
                                                                    {error}
                                                                </p>
                                                            )}
                                                            <button
                                                                type="submit"
                                                                className="w-full py-2 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900"
                                                            >
                                                                {isLoading ? (
                                                                    <Loader className="size-4 mx-auto animate-spin" />
                                                                ) : (
                                                                    "Submit"
                                                                )}
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                                <form method="dialog" className="modal-backdrop">
                                                    <button>Close</button>
                                                </form>
                                            </dialog>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full min-h-[400px] flex items-center justify-center">
                                <p>No Data Found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
