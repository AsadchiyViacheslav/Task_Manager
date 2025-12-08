package com.taskmanager.repository;

import com.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCreatorIdOrderByCreatedAtDesc(Long creatorId);
    Optional<Task> findByIdAndCreatorId(Long id, Long creatorId);
    void deleteByIdAndCreatorId(Long id, Long creatorId);

    List<Task> findByCreatorIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long creatorId,
            LocalDateTime start,
            LocalDateTime end
    );
}