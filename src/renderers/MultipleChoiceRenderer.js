import { BaseQuestionRenderer } from './BaseQuestionRenderer.js';

/**
 * MultipleChoiceRenderer - Handles multiple choice questions (multiple answers allowed)
 */
export class MultipleChoiceRenderer extends BaseQuestionRenderer {
    getType() {
        return 'Multiple Choice';
    }

    render(question, currentAnswer, questionIndex) {
        const selectedAnswers = currentAnswer || [];
        
        const answersHTML = question.answer.map((option, index) => {
            const isSelected = selectedAnswers.includes(option);
            return `
                <div class="answer-option ${isSelected ? 'selected' : ''}" 
                     data-answer="${this.escapeHtml(option)}"
                     onclick="toggleMultipleChoice(this)">
                    <input type="checkbox" 
                           ${isSelected ? 'checked' : ''} 
                           style="margin-right: 10px;">
                    ${this.escapeHtml(option)}
                </div>
            `;
        }).join('');

        return this.createQuestionHTML(question, questionIndex, answersHTML);
    }

    getAnswer(container) {
        const selectedOptions = container.querySelectorAll('.answer-option.selected');
        return Array.from(selectedOptions).map(option => option.dataset.answer);
    }

    setAnswer(container, answer) {
        const options = container.querySelectorAll('.answer-option');
        const answerArray = Array.isArray(answer) ? answer : [];
        
        options.forEach(option => {
            const isSelected = answerArray.includes(option.dataset.answer);
            const checkbox = option.querySelector('input[type="checkbox"]');
            
            if (isSelected) {
                option.classList.add('selected');
                checkbox.checked = true;
            } else {
                option.classList.remove('selected');
                checkbox.checked = false;
            }
        });
    }

    validateAnswer(answer) {
        return Array.isArray(answer) && answer.length > 0;
    }
}