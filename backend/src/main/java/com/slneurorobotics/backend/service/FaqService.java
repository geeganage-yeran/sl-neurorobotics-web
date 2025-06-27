package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.dto.request.FaqRequestDTO;
import com.slneurorobotics.backend.dto.response.FaqResponseDTO;
import com.slneurorobotics.backend.entity.FAQ;
import com.slneurorobotics.backend.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FaqService {

    private final FaqRepository faqRepository;

    public FAQ saveFaq(FaqRequestDTO faqRequestDTO) {
        FAQ faq = new FAQ();
        faq.setQuestion(faqRequestDTO.getQuestion());
        faq.setAnswer(faqRequestDTO.getAnswer());
        faq.setCreatedBy(faqRequestDTO.getCreatedBy());
        faq.setUpdatedBy(faqRequestDTO.getCreatedBy());

        return faqRepository.save(faq);
    }

    public List<FaqResponseDTO> getAllFaqs() {
        List<FAQ> faqs = faqRepository.findAll();
        return faqs.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private FaqResponseDTO convertToResponseDTO(FAQ faq) {
        FaqResponseDTO dto = new FaqResponseDTO();
        dto.setId(faq.getId());
        dto.setQuestion(faq.getQuestion());
        dto.setAnswer(faq.getAnswer());
        dto.setCreatedAt(faq.getCreatedAt());
        dto.setUpdatedAt(faq.getUpdatedAt());
        return dto;
    }

    public FAQ updateFaq(Long id, FaqRequestDTO faqUpdateRequestDTO) {
        FAQ existingFaq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found with id: " + id));

        existingFaq.setQuestion(faqUpdateRequestDTO.getQuestion());
        existingFaq.setAnswer(faqUpdateRequestDTO.getAnswer());
        existingFaq.setUpdatedBy(faqUpdateRequestDTO.getCreatedBy());

        return faqRepository.save(existingFaq);
    }

    public void deleteFaq(Long id) {
        if (!faqRepository.existsById(id)) {
            throw new RuntimeException("FAQ not found with id: " + id);
        }
        faqRepository.deleteById(id);
    }

}
