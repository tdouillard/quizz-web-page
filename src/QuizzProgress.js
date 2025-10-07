/**
 * QuizzProgress class - Tracks user progress and answers
 */
export class QuizzProgress {
  constructor() {
    this.answers = new Map();
    this.startTime = null;
    this.endTime = null;
    this.totalQuestions = 0;
  }

  /**
   * Initialize progress tracking
   * @param {number} totalQuestions - Total number of questions
   */
  initialize(totalQuestions) {
    this.totalQuestions = totalQuestions;
    this.answers.clear();
    this.startTime = new Date();
    this.endTime = null;
  }

  /**
   * Store answer for a question
   * @param {number} questionIndex - Question index
   * @param {any} answer - User's answer
   */
  setAnswer(questionIndex, answer) {
    this.answers.set(questionIndex, {
      answer: answer,
      timestamp: new Date(),
    });
  }

  /**
   * Get answer for a question
   * @param {number} questionIndex - Question index
   * @returns {any} - User's answer or null if not answered
   */
  getAnswer(questionIndex) {
    const answerData = this.answers.get(questionIndex);
    return answerData ? answerData.answer : null;
  }

  /**
   * Check if question has been answered
   * @param {number} questionIndex - Question index
   * @returns {boolean} - Has answer
   */
  hasAnswer(questionIndex) {
    return this.answers.has(questionIndex);
  }

  /**
   * Get number of answered questions
   * @returns {number} - Count of answered questions
   */
  getAnsweredCount() {
    return this.answers.size;
  }

  /**
   * Get progress percentage
   * @returns {number} - Progress percentage (0-100)
   */
  getProgressPercentage() {
    if (this.totalQuestions === 0) {
      return 0;
    }
    return Math.round((this.getAnsweredCount() / this.totalQuestions) * 100);
  }

  /**
   * Check if quiz is complete
   * @returns {boolean} - Is complete
   */
  isComplete() {
    return this.getAnsweredCount() === this.totalQuestions;
  }

  /**
   * Mark quiz as finished
   */
  finish() {
    this.endTime = new Date();
  }

  /**
   * Get elapsed time in seconds
   * @returns {number} - Elapsed time in seconds
   */
  getElapsedTime() {
    if (!this.startTime) {
      return 0;
    }

    const endTime = this.endTime || new Date();
    return Math.floor((endTime - this.startTime) / 1000);
  }

  /**
   * Get formatted elapsed time
   * @returns {string} - Formatted time (MM:SS)
   */
  getFormattedElapsedTime() {
    const seconds = this.getElapsedTime();
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  /**
   * Get all answers
   * @returns {Object} - All answers with metadata
   */
  getAllAnswers() {
    const result = {};
    for (const [questionIndex, answerData] of this.answers) {
      result[questionIndex] = answerData;
    }
    return result;
  }

  /**
   * Reset progress
   */
  reset() {
    this.answers.clear();
    this.startTime = null;
    this.endTime = null;
    this.totalQuestions = 0;
  }

  /**
   * Export progress data
   * @returns {Object} - Progress data
   */
  exportData() {
    return {
      answers: this.getAllAnswers(),
      startTime: this.startTime,
      endTime: this.endTime,
      totalQuestions: this.totalQuestions,
      answeredCount: this.getAnsweredCount(),
      progressPercentage: this.getProgressPercentage(),
      elapsedTime: this.getElapsedTime(),
      isComplete: this.isComplete(),
    };
  }
}
