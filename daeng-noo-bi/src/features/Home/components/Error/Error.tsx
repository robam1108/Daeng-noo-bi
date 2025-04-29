import "./Error.scss";

interface Props {
    error?: Error;
    onRetry?: () => void;
}

export default function Error({ error, onRetry }: Props) {
    return (
        <div>
            <div className="Error">
                <div className="error-icon">⚠️</div>
                <h2>문제가 발생했습니다.</h2>
                <p>죄송합니다. 요청을 처리하는 중 오류가 발생했어요.</p>
                {error && <pre className="error-message">{error.message}</pre>}
                <button onClick={onRetry}>다시 시도하기</button>
            </div>
        </div>
    )
}