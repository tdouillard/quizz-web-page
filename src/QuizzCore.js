/**
 * QuizzCore class - Manages quiz data loading and validation
 */
export class QuizzCore {
  constructor() {
    this.quizData = null;
    this.currentQuestionIndex = 0;
  }

  /**
   * Load quiz data from JSON
   * @param {Object} quizData - The quiz data object
   * @returns {boolean} - Success status
   */
  loadQuiz(quizData) {
    console.debug("Loading quiz data:", quizData);
    if (!this.validateQuizData(quizData)) {
      throw new Error("Invalid quiz data format");
    }

    this.quizData = quizData;
    this.currentQuestionIndex = 0;
    return true;
  }

  /**
   * Validate quiz data format
   * @param {Object} data - Quiz data to validate
   * @returns {boolean} - Validation result
   */
  validateQuizData(data) {
    if (!data || typeof data !== "object") {
      return false;
    }

    if (!data.name || typeof data.name !== "string") {
      return false;
    }

    if (!Array.isArray(data.Questions)) {
      return false;
    }

    // Validate each question
    for (const question of data.Questions) {
      if (!question.name || typeof question.name !== "string") {
        return false;
      }

      if (!question.type || typeof question.type !== "string") {
        return false;
      }

      if (!Array.isArray(question.answer)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get quiz title
   * @returns {string} - Quiz title
   */
  getQuizTitle() {
    return this.quizData ? this.quizData.name : "";
  }

  /**
   * Get current question
   * @returns {Object|null} - Current question object
   */
  getCurrentQuestion() {
    if (!this.quizData || !this.quizData.Questions) {
      return null;
    }

    return this.quizData.Questions[this.currentQuestionIndex] || null;
  }

  /**
   * Get question by index
   * @param {number} index - Question index
   * @returns {Object|null} - Question object
   */
  getQuestion(index) {
    if (
      !this.quizData ||
      !this.quizData.Questions ||
      index < 0 ||
      index >= this.quizData.Questions.length
    ) {
      return null;
    }

    return this.quizData.Questions[index];
  }

  /**
   * Get total number of questions
   * @returns {number} - Total questions count
   */
  getTotalQuestions() {
    return this.quizData && this.quizData.Questions
      ? this.quizData.Questions.length
      : 0;
  }

  /**
   * Navigate to specific question
   * @param {number} index - Question index
   * @returns {boolean} - Success status
   */
  goToQuestion(index) {
    if (index < 0 || index >= this.getTotalQuestions()) {
      return false;
    }

    this.currentQuestionIndex = index;
    return true;
  }

  /**
   * Move to next question
   * @returns {boolean} - Success status
   */
  nextQuestion() {
    return this.goToQuestion(this.currentQuestionIndex + 1);
  }

  /**
   * Move to previous question
   * @returns {boolean} - Success status
   */
  previousQuestion() {
    return this.goToQuestion(this.currentQuestionIndex - 1);
  }

  /**
   * Check if current question is first
   * @returns {boolean} - Is first question
   */
  isFirstQuestion() {
    return this.currentQuestionIndex === 0;
  }

  /**
   * Check if current question is last
   * @returns {boolean} - Is last question
   */
  isLastQuestion() {
    return this.currentQuestionIndex === this.getTotalQuestions() - 1;
  }

  /**
   * Get current question index
   * @returns {number} - Current question index
   */
  getCurrentQuestionIndex() {
    return this.currentQuestionIndex;
  }
}
