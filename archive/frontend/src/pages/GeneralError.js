import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-6xl font-bold text-blue-500 mb-10">Something went wrong!</h1>
            <p className="text-4xl font-bold text-red-500">{error.status + " " + error.statusText || error.message}</p>
        </div>
    );
}