import { useContext, useEffect } from "react";
import HomeContext from "../state/index.context";
import Setting from "../pages/Setting";
import TaskManage from "../pages/TaskManage";

function CustomRouter() {
    const {
        state: { page },
        dispatch: homeDispatch,
    } = useContext(HomeContext);
    useEffect(() => {
        console.log(page);
    }, [page])
    const renderPage = () => {
        if (page == "task_management") {
            return <TaskManage />
        } else if(page == "settings") {
            return <Setting />
        }
    }
    return (
        <div>
            {
                renderPage()
            }
        </div>
    )
}

export default CustomRouter;