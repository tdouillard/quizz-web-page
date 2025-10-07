import { BaseQuestionRenderer } from "./BaseQuestionRenderer.js";

/**
 * QuizzResultRenderer - responsible for rendering final quiz results summary
 * Not a question renderer per se, but keeps rendering concerns modular.
 */
export class QuizzResultRenderer extends BaseQuestionRenderer {
  getType() {
    return "results";
  }

  /**
   * Render results block
   * @param {Object} context - { progress, core }
   * @returns {string} HTML
   */
  renderResults(context) {
    const { progress, core } = context;
    const results = progress.exportData();
    const elapsed = progress.getFormattedElapsedTime();
    const answersHTML = this.generateAnswerSummary(core, progress);

    const statTiles = [
      { icon: "⏱️", label: "Time", value: elapsed },
      {
        icon: "❓",
        label: "Answered",
        value: `${results.answeredCount} / ${results.totalQuestions}`,
      },
      {
        icon: "✅",
        label: "Completion",
        value: `${results.progressPercentage}%`,
      },
    ];

    const statTilesHTML = statTiles
      .map((tile) => this.renderStatTile(tile))
      .join("");

    return `
        <div class="quiz-results">
            <header class="quiz-results-header">
                <h2>🎉 Quiz Completed!</h2>
            </header>
            <section class="quiz-stats" aria-labelledby="quiz-stats-heading">
                <h3 id="quiz-stats-heading" class="visually-hidden">Summary</h3>
                <div class="quiz-stats-grid">
                    ${statTilesHTML}
                </div>
            </section>
            <section class="quiz-answers" aria-labelledby="quiz-answers-heading">
                <h3 id="quiz-answers-heading" class="answers-heading">📝 Your Answers</h3>
                <div class="answers-list">${answersHTML}</div>
            </section>
            <div class="quiz-actions">
                <button class="restart-button" onclick="restartQuiz()">🔁 Start Over</button>
            </div>
        </div>`;
  }

  renderStatTile({ icon, label, value }) {
    return `
        <div class="stat-tile">
            <div class="stat-icon">${icon}</div>
            <div class="stat-label">${label}</div>
            <div class="stat-value">${this.escapeHtml(String(value))}</div>
        </div>`;
  }

  generateAnswerSummary(core, progress) {
    let out = "";
    for (let i = 0; i < core.getTotalQuestions(); i++) {
      const question = core.getQuestion(i);
      const answer = progress.getAnswer(i);
      out += this.renderAnswerRow(i, question, answer);
    }
    return out;
  }

  renderAnswerRow(index, question, answer) {
    const qLabel = `Q${index + 1}`;
    return `
      <article class="answer-summary" data-question-index="${index}">
        <div class="answer-inner">
          <div class="answer-summary-header">
            <span class="q-label">${qLabel}</span>
            <span class="q-text">${this.escapeHtml(question.name)}</span>
          </div>
          <div class="answer-separator"></div>
          <div class="answer-summary-body">
            <span class="answer-label">Answer:</span>
            <span class="answer-value">${this.formatAnswer(answer)}</span>
          </div>
        </div>
      </article>`;
  }

  formatAnswer(answer) {
    console.debug("Formatting answer:", answer);
    if (
      answer === null ||
      answer === undefined ||
      answer === "" ||
      (Array.isArray(answer) && !answer.length)
    ) {
      return "<em>Not answered</em>";
    }
    if (Array.isArray(answer)) {
      return answer.length
        ? answer.map((a) => this.escapeHtml(String(a))).join(", ")
        : "<em>Not answered</em>";
    }
    if (typeof answer === "object") {
      // Pretty-print shallow object { key: value }
      const entries = Object.entries(answer).map(
        ([k, v]) =>
          `${this.escapeHtml(k)}: ${this.escapeHtml(String(v ?? ""))}`,
      );
      return entries.length ? entries.join(" | ") : "<em>Not answered</em>";
    }
    return this.escapeHtml(String(answer));
  }
}
