import { QuizzCore } from "./QuizzCore.js";
import { QuizzRender } from "./QuizzRender.js";
import { QuizzResultRenderer } from "./renderers/QuizzResultRenderer.js";
import { QuizzProgress } from "./QuizzProgress.js";
import { sampleQuizData } from "./sampleData.js";

// Global application state
let quizzCore, quizzRender, quizzProgress, quizzResultRenderer;

/**
 * Initialize the quiz application
 */
function initializeQuiz() {
  try {
    // Create instances
    quizzCore = new QuizzCore();
    quizzRender = new QuizzRender();
    quizzProgress = new QuizzProgress();
    quizzResultRenderer = new QuizzResultRenderer();

    // Load quiz data
    quizzCore.loadQuiz(sampleQuizData);

    // Initialize progress tracking
    quizzProgress.initialize(quizzCore.getTotalQuestions());

    // Render initial state
    renderCurrentQuestion();
    updateUI();

    console.log("Quiz initialized successfully");
    console.log("Available question types:", quizzRender.getAvailableTypes());
  } catch (error) {
    console.error("Failed to initialize quiz:", error);
    showError("Failed to load quiz. Please try again.");
  }
}

/**
 * Render the current question
 */
function renderCurrentQuestion() {
  const question = quizzCore.getCurrentQuestion();
  const currentAnswer = quizzProgress.getAnswer(
    quizzCore.getCurrentQuestionIndex(),
  );

  quizzRender.renderQuestionIntoContainer(
    question,
    currentAnswer,
    quizzCore.getCurrentQuestionIndex(),
  );
}

/**
 * Update UI state (progress, buttons, etc.)
 */
function updateUI() {
  // Update header
  quizzRender.renderQuizHeader(
    quizzCore.getQuizTitle(),
    quizzProgress.getProgressPercentage(),
  );

  // Update navigation buttons
  updateNavigationButtons();
}

/**
 * Update navigation button states
 */
function updateNavigationButtons() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const submitBtn = document.getElementById("submit-btn");

  if (prevBtn) {
    prevBtn.disabled = quizzCore.isFirstQuestion();
  }

  if (quizzCore.isLastQuestion()) {
    if (nextBtn) nextBtn.style.display = "none";
    if (submitBtn) submitBtn.style.display = "inline-block";
  } else {
    if (nextBtn) nextBtn.style.display = "inline-block";
    if (submitBtn) submitBtn.style.display = "none";
  }
}

/**
 * Navigate to next/previous question
 * @param {number} direction - 1 for next, -1 for previous
 */
function navigateQuestion(direction) {
  // Navigate
  if (direction > 0) {
    // Save current answer
    saveCurrentAnswer();
    quizzCore.nextQuestion();
  } else {
    quizzCore.previousQuestion();
  }

  // Render new question and update UI
  renderCurrentQuestion();
  updateUI();
}

/**
 * Save current answer to progress
 */
function saveCurrentAnswer() {
  const container = document.getElementById("question-container");
  if (!container) return;

  const answer = quizzRender.getCurrentAnswer(container);
  quizzProgress.setAnswer(quizzCore.getCurrentQuestionIndex(), answer);
}

/**
 * Submit the quiz
 */
function submitQuiz() {
  // Save final answer
  saveCurrentAnswer();

  //update progress UI one last time before showing results
  updateUI();

  // Mark as finished
  quizzProgress.finish();

  // Show results
  showQuizResults();
}

/**
 * Show quiz results
 */
function showQuizResults() {
  const container = document.getElementById("question-container");
  const resultsHTML = quizzResultRenderer.renderResults({
    core: quizzCore,
    progress: quizzProgress,
  });
  container.innerHTML = resultsHTML;
  document.getElementById("prev-btn").style.display = "none";
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("submit-btn").style.display = "none";
}

/**
 * Generate answer summary HTML
 */
// (generateAnswerSummary & formatAnswer moved into QuizzResultRenderer)

/**
 * Restart the quiz
 */
function restartQuiz() {
  quizzProgress.reset();
  quizzCore.goToQuestion(0);
  quizzProgress.initialize(quizzCore.getTotalQuestions());

  renderCurrentQuestion();
  updateUI();

  // Show navigation buttons
  document.getElementById("prev-btn").style.display = "inline-block";
  document.getElementById("next-btn").style.display = "inline-block";
  document.getElementById("submit-btn").style.display = "none";
}

/**
 * Show error message
 */
function showError(message) {
  const container = document.getElementById("question-container");
  if (container) {
    container.innerHTML = `<div class="error" style="color: red; text-align: center;">${message}</div>`;
  }
}

// Question type specific interaction handlers
window.toggleMultipleChoice = function (element) {
  const checkbox = element.querySelector('input[type="checkbox"]');

  if (element.classList.contains("selected")) {
    element.classList.remove("selected");
    checkbox.checked = false;
  } else {
    element.classList.add("selected");
    checkbox.checked = true;
  }
};

window.selectSingleChoice = function (element) {
  const container = element.closest(".question-container");
  const options = container.querySelectorAll(".answer-option");
  const radios = container.querySelectorAll('input[type="radio"]');

  // Clear all selections
  options.forEach((option, index) => {
    option.classList.remove("selected");
    radios[index].checked = false;
  });

  // Select clicked option
  element.classList.add("selected");
  const radio = element.querySelector('input[type="radio"]');
  if (radio) {
    radio.checked = true;
  }
};

window.updateInputAnswer = function (input) {
  // Answer is automatically captured by the input value
  // This function can be used for real-time validation or feedback
};

// Global functions for navigation
window.navigateQuestion = navigateQuestion;
window.submitQuiz = submitQuiz;
window.restartQuiz = restartQuiz;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeQuiz);
