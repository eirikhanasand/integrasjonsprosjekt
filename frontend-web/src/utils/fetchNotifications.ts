// Fetches notifications from API
export default async function fetchNotifications(id: string): Promise<NotificationProps | null> {
    try {
        const response = await fetch(`http://127.0.0.1:8080/notification/${id}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch game board:', error);
        return null;
    }
}