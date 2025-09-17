import { MultipleChoiceRenderer } from './renderers/MultipleChoiceRenderer.js';
import { SingleChoiceRenderer } from './renderers/SingleChoiceRenderer.js';
import { InputRenderer } from './renderers/InputRenderer.js';

/**
 * QuizzRender class - Main rendering engine with pluggable question type renderers
 */
export class QuizzRender {
    constructor() {
        this.renderers = new Map();
        this.currentRenderer = null;
        
        // Register default renderers
        this.registerRenderer('Multiple Choice', new MultipleChoiceRenderer());
        this.registerRenderer('Single Choice', new SingleChoiceRenderer());
        this.registerRenderer('Input', new InputRenderer());
    }

    /**
     * Register a question type renderer
     * @param {string} type - Question type
     * @param {BaseQuestionRenderer} renderer - Renderer instance
     */
    registerRenderer(type, renderer) {
        this.renderers.set(type, renderer);
    }

    /**
     * Get available question types
     * @returns {string[]} - Array of available question types
     */
    getAvailableTypes() {
        return Array.from(this.renderers.keys());
    }

    /**
     * Check if a question type is supported
     * @param {string} type - Question type
     * @returns {boolean} - Is supported
     */
    isTypeSupported(type) {
        return this.renderers.has(type);
    }

    /**
     * Get renderer for a question type
     * @param {string} type - Question type
     * @returns {BaseQuestionRenderer|null} - Renderer instance
     */
    getRenderer(type) {
        return this.renderers.get(type) || null;
    }

    /**
     * Render a question
     * @param {Object} question - Question data
     * @param {any} currentAnswer - Current user answer
     * @param {number} questionIndex - Question index
     * @returns {string} - HTML string
     */
    renderQuestion(question, currentAnswer, questionIndex) {
        if (!question) {
            return '<div class="error">Question data is missing</div>';
        }

        const renderer = this.getRenderer(question.type);
        if (!renderer) {
            return `<div class="error">Unsupported question type: ${question.type}</div>`;
        }

        this.currentRenderer = renderer;
        
        try {
            return renderer.render(question, currentAnswer, questionIndex);
        } catch (error) {
            console.error('Error rendering question:', error);
            return `<div class="error">Error rendering question: ${error.message}</div>`;
        }
    }

    /**
     * Get answer from current question DOM
     * @param {HTMLElement} container - Question container element
     * @returns {any} - User answer
     */
    getCurrentAnswer(container) {
        if (!this.currentRenderer || !container) {
            return null;
        }

        try {
            return this.currentRenderer.getAnswer(container);
        } catch (error) {
            console.error('Error getting answer:', error);
            return null;
        }
    }

    /**
     * Set answer in question DOM
     * @param {HTMLElement} container - Question container element
     * @param {any} answer - Answer to set
     */
    setCurrentAnswer(container, answer) {
        if (!this.currentRenderer || !container) {
            return;
        }

        try {
            this.currentRenderer.setAnswer(container, answer);
        } catch (error) {
            console.error('Error setting answer:', error);
        }
    }

    /**
     * Validate current answer
     * @param {any} answer - Answer to validate
     * @param {string} questionType - Question type
     * @returns {boolean} - Is valid
     */
    validateAnswer(answer, questionType) {
        const renderer = this.getRenderer(questionType);
        if (!renderer) {
            return false;
        }

        try {
            return renderer.validateAnswer(answer);
        } catch (error) {
            console.error('Error validating answer:', error);
            return false;
        }
    }

    /**
     * Render quiz title and progress
     * @param {string} title - Quiz title
     * @param {number} progress - Progress percentage (0-100)
     * @returns {Object} - Title and progress elements info
     */
    renderQuizHeader(title, progress) {
        const titleElement = document.getElementById('quiz-title');
        const progressElement = document.getElementById('progress-fill');

        if (titleElement) {
            titleElement.textContent = title;
        }

        if (progressElement) {
            progressElement.style.width = `${progress}%`;
        }

        return {
            titleUpdated: !!titleElement,
            progressUpdated: !!progressElement,
            progress: progress
        };
    }

    /**
     * Clear question container
     */
    clearQuestionContainer() {
        const container = document.getElementById('question-container');
        if (container) {
            container.innerHTML = '';
        }
        this.currentRenderer = null;
    }

    /**
     * Render question into container
     * @param {Object} question - Question data
     * @param {any} currentAnswer - Current answer
     * @param {number} questionIndex - Question index
     */
    renderQuestionIntoContainer(question, currentAnswer, questionIndex) {
        const container = document.getElementById('question-container');
        if (!container) {
            console.error('Question container not found');
            return;
        }

        const questionHTML = this.renderQuestion(question, currentAnswer, questionIndex);
        container.innerHTML = questionHTML;
    }
}