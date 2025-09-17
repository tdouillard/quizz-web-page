import { BaseQuestionRenderer } from './BaseQuestionRenderer.js';

/**
 * SingleChoiceRenderer - Handles single choice questions (only one answer allowed)
 */
export class SingleChoiceRenderer extends BaseQuestionRenderer {
    getType() {
        return 'Single Choice';
    }

    render(question, currentAnswer, questionIndex) {
        const answersHTML = question.answer.map((option, index) => {
            const isSelected = currentAnswer === option;
            return `
                <div class="answer-option ${isSelected ? 'selected' : ''}" 
                     data-answer="${this.escapeHtml(option)}"
                     onclick="selectSingleChoice(this)">
                    <input type="radio" 
                           name="question_${questionIndex}" 
                           ${isSelected ? 'checked' : ''} 
                           style="margin-right: 10px;">
                    ${this.escapeHtml(option)}
                </div>
            `;
        }).join('');

        return this.createQuestionHTML(question, questionIndex, answersHTML);
    }

    getAnswer(container) {
        const selectedOption = container.querySelector('.answer-option.selected');
        return selectedOption ? selectedOption.dataset.answer : null;
    }

    setAnswer(container, answer) {
        const options = container.querySelectorAll('.answer-option');
        const radios = container.querySelectorAll('input[type="radio"]');
        
        options.forEach((option, index) => {
            const isSelected = option.dataset.answer === answer;
            const radio = radios[index];
            
            if (isSelected) {
                option.classList.add('selected');
                radio.checked = true;
            } else {
                option.classList.remove('selected');
                radio.checked = false;
            }
        });
    }

    validateAnswer(answer) {
        return typeof answer === 'string' && answer.trim() !== '';
    }
}