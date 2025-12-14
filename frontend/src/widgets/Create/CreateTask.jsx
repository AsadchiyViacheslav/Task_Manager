import Button from "../../shared/ui/Button/Button";
import Header from "../../shared/ui/Header/Header";
import Menu from "../../shared/ui/Menu/Menu";
import Gallery from "../../assets/icons/gallery.svg?react";
import s from "./CreateTask.module.css";
import { useRef, useState } from "react";
import InputField from "../../shared/ui/InputField/InputField";
import Calendar from "../../shared/ui/Calendar/Calendar";
import SubTask from "./Subtask/Subtask";
import { useNavigate } from "react-router-dom";
import { useTasksStore } from "../../features/tasks/model/useTasksStore";
import { validateTask } from "../../features/tasks/lib/validation";
import { usePhotoApi } from "../../features/photo/photo";
import { useSubTasksApi } from "../../features/subTask/apiSubtasks";

export default function CreateTask() {
  const nav = useNavigate();
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    subtasks: [],
    priority: "LOW",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const inputRef = useRef();
  const createTask = useTasksStore((state) => state.create);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setImage(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const formatDateWithDots = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
  };

  const addSubTask = () => {
    setForm((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, ""],
    }));
  };

  const updateSubTask = (index, newValue) => {
    setForm((prev) => {
      const updated = [...prev.subtasks];
      updated[index] = newValue;
      return { ...prev, subtasks: updated };
    });
  };

  const removeSubTask = (index) => {
    setForm((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index),
    }));
  };

  const handleCreate = async () => {
    const validationErrors = validateTask(form); 
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const newTask = await createTask({
        title: form.title,
        description: form.description,
        deadline: form.date,
        priority: form.priority,
      });

      const taskId = newTask.id;

      if (image) {
        await usePhotoApi.upload(taskId, image);
      }

      for (const subtask of form.subtasks) {
        if (subtask.trim()) {
          await useSubTasksApi.create(taskId, { description: subtask });
        }
      }

      setForm({ title: "", description: "", date: "", subtasks: [], priority: "LOW" });
      setImage(null);
      nav("/tasks");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>
      <Menu />
      <div className={s.content}>
        <Header title={"Создание задачи"} />

        <div className={s.bg}>
          <div className={s.topGroup}>
            <div className={s.topLeftGroup}>
              <div
                className={`${s.img} ${s.loaded}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => {
                  if (!image) inputRef.current.click();
                  else setImage(null);
                }}
              >
                {!image && (
                  <>
                    <Gallery />
                    <input
                      type="file"
                      ref={inputRef}
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </>
                )}
                {image && (
                  <>
                    <div className={s.deleteOverlay} onClick={() => setImage(null)}>
                      Удалить
                    </div>
                    <img src={URL.createObjectURL(image)} alt="preview" className={s.preview} />
                  </>
                )}
              </div>
            </div>

            <Calendar
              value={form.date}
              onChange={(date) => setForm((p) => ({ ...p, date }))}
            />

            <InputField
              value={form.title}
              onChange={(v) => setForm((p) => ({ ...p, title: v }))}
              classNameInput={s.titleInput}
              classNameField={s.titleField}
              placeholder="Название"
              error={errors.title}
            />

            <InputField
              value={formatDateWithDots(form.date)}
              type="text"
              placeholder="дд-мм-гггг"
              classNameInput={s.inputWrapper}
              disabled={true}
              error={errors.date}
            />
          </div>

          <div>
            <h2 className={s.title}>Описание</h2>
            <InputField
              value={form.description}
              onChange={(v) => setForm((p) => ({ ...p, description: v }))}
              classNameInput={s.descriptionField}
              as={"textarea"}
              error={errors.description}
            />
          </div>

          <div>
            <h2 className={s.title}>Детали задачи</h2>

            <p className={s.addSubTask} onClick={addSubTask}>
              + Добавить подзадачу
            </p>
            <div className={s.subTasks}>
              {form.subtasks.map((t, i) => (
                <SubTask
                  key={i}
                  value={t}
                  onChange={(value) => updateSubTask(i, value)}
                  onEmpty={() => removeSubTask(i)}
                  autoFocus={true}
                />
              ))}
            </div>
          </div>

          <div className={s.button}>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? "Создание..." : "Создать"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

