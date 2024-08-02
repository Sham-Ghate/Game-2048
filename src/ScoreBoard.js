import React from 'react';
import './ScoreBoard.css';

const ScoreBoard = ({ currentScore, bestScore }) => {
    return (
        <div className="score-board">
            <div className="score">
                <span>Score:</span> {currentScore}
            </div>
            <div className="best-score">
                <span>Best Score:</span> {bestScore}
            </div>
        </div>
    );
};

export default ScoreBoard;
