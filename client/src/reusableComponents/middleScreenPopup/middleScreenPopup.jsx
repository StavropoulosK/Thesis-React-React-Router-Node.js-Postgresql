import "./middleScreenPopup.css"

import { useTranslation } from "react-i18next";

export default function MiddleScreenPopup({ message, onConfirm, onClose, namespace }) {

    const {t, i18n} = useTranslation(namespace)


    return (
      <div className="popup-box">
        <button className="popup-close" onClick={onClose}>×</button>
        <div className="popup-message">{message}</div>
        <div className="popup-actions">
          <button className="popup-btn cancel" onClick={onClose}>{t("close")}</button>
          <button className="popup-btn ok" onClick={onConfirm}>{t("ok")}</button>
        </div>
      </div>
    );
  }