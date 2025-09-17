/**
 * BaseQuestionRenderer - Abstract base class for question renderers
 */
export class BaseQuestionRenderer {
    constructor() {
        if (this.constructor === BaseQuestionRenderer) {
            throw new Error('Cannot instantiate abstract class BaseQuestionRenderer');
        }
    }

    /**
     * Render the question HTML
     * @param {Object} question - Question data
     * @param {any} currentAnswer - Current user answer
     * @param {number} questionIndex - Question index
     * @returns {string} - HTML string
     */
    render(question, currentAnswer, questionIndex) {
        throw new Error('render method must be implemented by subclass');
    }

    /**
     * Get answer from DOM
     * @param {HTMLElement} container - Question container element
     * @returns {any} - User answer
     */
    getAnswer(container) {
        throw new Error('getAnswer method must be implemented by subclass');
    }

    /**
     * Set answer in DOM
     * @param {HTMLElement} container - Question container element
     * @param {any} answer - Answer to set
     */
    setAnswer(container, answer) {
        throw new Error('setAnswer method must be implemented by subclass');
    }

    /**
     * Validate answer
     * @param {any} answer - Answer to validate
     * @returns {boolean} - Is valid
     */
    validateAnswer(answer) {
        return answer !== null && answer !== undefined && answer !== '';
    }

    /**
     * Create base question HTML structure
     * @param {Object} question - Question data
     * @param {number} questionIndex - Question index
     * @param {string} answersHTML - HTML for answer options
     * @returns {string} - Complete question HTML
     */
    createQuestionHTML(question, questionIndex, answersHTML) {
        return `
            <div class="question-container" data-question-index="${questionIndex}">
                <div class="question-title">${this.escapeHtml(question.name)}</div>
                <div class="answers-container">
                    ${answersHTML}
                </div>
            </div>
        `;
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Get question type name
     * @returns {string} - Question type
     */
    getType() {
        return 'base';
    }
}