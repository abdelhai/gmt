from fastapi import FastAPI
from deta import Deta, Base
from pydantic import BaseModel

app = FastAPI()
deta = Deta()
tasks = deta.Base("tasks")

class TaskModel(BaseModel):
    title: str
    description: str
    completed: bool

@app.get("/tasks")
async def list_tasks():
    result = tasks.fetch()
    fetched_tasks = [item for item in result.items]
    return {"tasks": fetched_tasks}


@app.get("/tasks/{task_key}")
async def get_task(task_key: str):
    task = tasks.get(task_key)
    return {"task": task}

@app.put("/tasks/{task_key}")
async def update_task(task_key: str, updated_task: TaskModel):
    tasks.update(task_key, updated_task.dict())
    return {"task": tasks.get(task_key)}

@app.delete("/tasks/{task_key}")
async def delete_task(task_key: str):
    tasks.delete(task_key)
    return {"result": "Task deleted"}

@app.get("/tasks")
async def list_tasks():
    result = tasks.fetch()
    return {"tasks": list(result)}
