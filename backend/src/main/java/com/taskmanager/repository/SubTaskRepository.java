package com.taskmanager.repository;

import com.taskmanager.model.SubTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubTaskRepository extends JpaRepository<SubTask, Long> {
    List<SubTask> findByTaskId(Long taskId);
    Optional<SubTask> findByIdAndTaskCreatorId(Long subTaskId, Long creatorId);
    void deleteByTaskId(Long taskId);
}