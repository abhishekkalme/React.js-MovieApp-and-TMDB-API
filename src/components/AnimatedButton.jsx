import React from 'react';
import styled from 'styled-components';

const AnimatedButton = ({ checked, onChange, icon, label, count, activeCount, id }) => {
    return (
        <StyledWrapper>
            <div className="like-button">
                <input
                    className="on"
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                />
                <label className="like" htmlFor={id}>
                    <div className="like-icon-wrapper">
                        {icon}
                    </div>
                    <span className="like-text">{label}</span>
                </label>
                {count !== undefined && (
                    <>
                        <span className="like-count one">{count}</span>
                        <span className="like-count two">{activeCount}</span>
                    </>
                )}
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  input[type="checkbox"] {
    display: none;
  }

  .like-button {
    position: relative;
    cursor: pointer;
    display: flex;
    height: 48px;
    width: 156px;
    border-radius: 16px;
    border: none;
    background-color: #1d1d1d;
    overflow: hidden;

  }
  
  .like-button:active {
    transform: scale(0.95);
  }

  .like {
    width: 75%;
    height: 100%;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: flex-start;
    padding-left: 15px;
    gap: 10px;
  }

  .like-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-out;
  }

  .like-icon-wrapper svg {
    fill: #505050;
    height: 24px;
    width: 24px;
    transition: all 0.2s ease-out;
  }

  .like-text {
    color: #fcfcfc;
    font-size: 15px;
    font-weight: 600;
    font-family: inherit;
  }

  .like-count {
    position: absolute;
    right: 10px;
    width: 25%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #717070;
    font-size: 14px;
    border-left: 2px solid #4e4e4e;
    transition: all 0.5s ease-out;
  }

  .like-count.two {
    transform: translateY(40px);
  }

  .on:checked ~ .like .like-icon-wrapper svg {
    fill: #fc4e4e;
    transform: scale(1.2);
  }
  
  /* If it's a heart icon, specifically animate it */
  .on:checked ~ .like .like-icon-wrapper .heart-path {
    animation: enlarge 0.3s ease-out 1;
  }

  .on:checked ~ .like-count.two {
    transform: translateY(0);
    color: #fcfcfc;
  }

  .on:checked ~ .like-count.one {
    transform: translateY(-40px);
  }

  @keyframes enlarge {
    0% {
      transform: scale(0.5);
    }
    100% {
      transform: scale(1.2);
    }
  }
`;

export default AnimatedButton;
