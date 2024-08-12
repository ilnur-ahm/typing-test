import { FunctionComponent, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchText,
  setText,
  setCurrentCharIndex,
  increasePressingCount,
  setMistakes,
} from "../redux/store/textSlice";
import { setIsTimerOn } from "../redux/store/timerSlice";
import { setIsTestFinished } from "../redux/store/testSlice";
import { getCurrentChar, compareChars } from "../helpers/charTransform";
import Loader from "./ui/Loader";

const Text: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const text = useAppSelector((state) => state.textSlice.text);
  const isLoading = useAppSelector((state) => state.textSlice.isLoading);
  const error = useAppSelector((state) => state.textSlice.error);
  const currentCharIndex = useAppSelector(
    (state) => state.textSlice.currentCharIndex
  );
  const mistakes = useAppSelector((state) => state.textSlice.mistakes);
  const pressingCount = useAppSelector(
    (state) => state.textSlice.pressingCount
  );
  const sentences = useAppSelector((state) => state.testSlice.sentences);
  // Ссылка на текстовое поле
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Загрузка текста при монтировании компонента
    dispatch(fetchText(sentences));
  }, [dispatch]);

  useEffect(() => {
    const newText = getCurrentChar(text, currentCharIndex);
    // Обновление текста с текущим символом
    dispatch(setText(newText));
  }, [dispatch, currentCharIndex]);

  useEffect(() => {
    if (pressingCount === 0 && text.length > 0) {
      // Запуск таймера при начале ввода
      dispatch(setIsTimerOn(true));
      // Установка фокуса на текстовое поле
      inputRef.current?.focus();
    }

    if (currentCharIndex < text.length) {
      const keyPressHandler = (event: KeyboardEvent) => {
        const [newText, newCurrentIndex, newMistakes] = compareChars(
          text,
          currentCharIndex,
          event.key,
          mistakes
        );

        dispatch(setCurrentCharIndex(newCurrentIndex));
        dispatch(setText(newText));
        dispatch(setMistakes(newMistakes));
        dispatch(increasePressingCount());

        if (newCurrentIndex === text.length) {
          // Остановка таймера при завершении ввода
          dispatch(setIsTimerOn(false));
          // Установка состояния завершения теста
          dispatch(setIsTestFinished(true));
        }
      };

      document.addEventListener("keypress", keyPressHandler);

      return () => {
        document.removeEventListener("keypress", keyPressHandler);
      };
    }
  }, [dispatch, text]);

  return (
    <div
      className="test-text-wrapper"
      onClick={() => inputRef.current?.focus()}
    >
      {error && <p className="error-text">{error}</p>}
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {/* Скрытое текстовое поле, для корректной работы на мобильных
          устройствах */}
          <input
            type="text"
            ref={inputRef}
            style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
          />
          {text.map((item, index) => {
            return (
              <span className={item.class} key={index}>
                {item.char}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Text;
