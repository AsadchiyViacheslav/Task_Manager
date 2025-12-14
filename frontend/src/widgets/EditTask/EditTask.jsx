import Button from "../../shared/ui/Button/Button";
import Header from "../../shared/ui/Header/Header";
import Menu from "../../shared/ui/Menu/Menu";
import Gallery from "../../assets/icons/gallery.svg?react";
import { useRef, useState, useEffect } from "react";
import InputField from "../../shared/ui/InputField/InputField";
import Calendar from "../../shared/ui/Calendar/Calendar";
import { useNavigate, useParams } from "react-router-dom";
import { useTasksStore } from "../../features/tasks/model/useTasksStore";
import { usePhotoApi } from "../../features/photo/photo";
import { useSubTasksApi } from "../../features/subTask/apiSubtasks";
import s from "./EditTask.module.css";
import SubTask from "../Create/Subtask/Subtask";

export default function EditTask() {
  const nav = useNavigate();
  const { id } = useParams();
  const getById = useTasksStore((s) => s.getById);
  const updateTask = useTasksStore((s) => s.update);
  const [errors, setErrors] = useState({});

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    subtasks: [],
    priority: "LOW",
  });

  const inputRef = useRef();

  useEffect(() => {
    async function load() {
      const data = await getById(id);
      setForm({
        title: data.title,
        description: data.description,
        date: data.deadline,
        subtasks: data.subTasks,
        priority: data.priority,
      });
      setImage(data.photoPath);
    }
    load();
  }, [id]);

  const formatDateWithDots = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
  };

  const addSubTask = () => {
    setForm((prev) => ({ ...prev, subtasks: [...prev.subtasks, {description:""}] }));
  };

  const updateSubTask = (index, newValue) => {
    setForm((prev) => {
      const updated = [...prev.subtasks];
      updated[index].description = newValue;
      return { ...prev, subtasks: updated };
    });
  };

  const removeSubTask = (index) => {
    setForm((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index),
    }));
  };

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

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = "Название не может быть пустым";
    } else if (form.title.length < 3) {
      newErrors.title = "Название должно быть не меньше 3 символов";
    } else if (form.title.length > 100) {
      newErrors.title = "Название должно быть не больше 100 символов";
    }
    return newErrors;
  };

  const handleUpdate = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
        return;
    }

    setLoading(true);
    try {
        const taskId = id;

        // Обновляем саму задачу
        await updateTask(taskId, {
        title: form.title,
        description: form.description,
        deadline: form.date,
        priority: form.priority,
        });

        const existingSubtasks = await useSubTasksApi.getAll(taskId);
        const existingIds = existingSubtasks.map(st => st.id);

        const formIds = form.subtasks.filter(st => st.id).map(st => st.id);

        const toDeleteIds = existingIds.filter(id => !formIds.includes(id));
        for (const subtaskId of toDeleteIds) {
        await useSubTasksApi.delete(taskId, subtaskId);
        }

        for (const subtask of form.subtasks) {
        if (!subtask.description.trim()) continue;

        if (subtask.id) {
            await useSubTasksApi.update(taskId, subtask.id, {
            description: subtask.description,
            completed: subtask.completed ?? false,
            });
        } else {
            await useSubTasksApi.create(taskId, { description: subtask.description });
        }
        }

        if (image && image instanceof File) {
        await usePhotoApi.upload(taskId, image);
        }

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
        <Header title={"Редактирование задачи"} />

        <div className={s.bg}>
          <div className={s.topGroup}>
            <div className={s.topLeftGroup}>
              <div
                className={`${s.img} ${s.loaded}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => {
                    if (!image) inputRef.current.click()
                    else setImage(null)
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
                    <div
                      className={s.deleteOverlay}
                      onClick={() => setImage(null)}
                    >
                      Удалить
                    </div>
                    <img
                      src={image instanceof File ? URL.createObjectURL(image) : image}
                      alt="preview"
                      className={s.preview}
                    />
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
              disabled={true}
              classNameInput={s.inputWrapper}
            />
          </div>

          <div>
            <h2 className={s.title}>Описание</h2>
            <InputField
              value={form.description}
              onChange={(v) => setForm((p) => ({ ...p, description: v }))}
              classNameInput={s.descriptionField}
              as={"textarea"}
            />
          </div>

          <div>
            <h2 className={s.title}>Подзадачи</h2>
            <p className={s.addSubTask} onClick={addSubTask}>
              + Добавить подзадачу
            </p>
            <div className={s.subTasks}>
              {form.subtasks.map((t, i) => (
                <SubTask
                  key={i}
                  value={t.description}
                  onChange={(value) => updateSubTask(i, value)}
                  onEmpty={() => removeSubTask(i)}
                  autoFocus={true}
                />
              ))}
            </div>
          </div>

          <div className={s.button}>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
