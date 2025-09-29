package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface FaqRepository extends JpaRepository<FAQ, Long> {

    @Query("SELECT new map(f.question as question, f.answer as answer) FROM FAQ f")
    List<FAQ> findAllQuestionsAndAnswers();

    // Search in FAQ questions and answers
    @Query("SELECT f FROM FAQ f WHERE " +
            "LOWER(f.question) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(f.answer) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<FAQ> findBySearchTerm(@Param("searchTerm") String searchTerm);

    // Find by question containing
    List<FAQ> findByQuestionContainingIgnoreCase(String question);
}
