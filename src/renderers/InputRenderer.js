import { BaseQuestionRenderer } from './BaseQuestionRenderer.js';

/**
 * InputRenderer - Handles text input questions
 */
export class InputRenderer extends BaseQuestionRenderer {
    getType() {
        return 'Input';
    }

    render(question, currentAnswer, questionIndex) {
        const value = currentAnswer || '';
        
        const answersHTML = `
            <input type="text" 
                   class="text-input" 
                   value="${this.escapeHtml(value)}" 
                   placeholder="Enter your answer here..."
                   onchange="updateInputAnswer(this)"
                   onkeyup="updateInputAnswer(this)">
        `;

        return this.createQuestionHTML(question, questionIndex, answersHTML);
    }

    getAnswer(container) {
        const input = container.querySelector('.text-input');
        return input ? input.value.trim() : '';
    }

    setAnswer(container, answer) {
        const input = container.querySelector('.text-input');
        if (input) {
            input.value = answer || '';
        }
    }

    validateAnswer(answer) {
        return typeof answer === 'string' && answer.trim() !== '';
    }
}