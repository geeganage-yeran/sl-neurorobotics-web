package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface FaqRepository extends JpaRepository<FAQ, Long> {

    @Query("SELECT new map(f.question as question, f.answer as answer) FROM FAQ f")
    List<FAQ> findAllQuestionsAndAnswers();
}
