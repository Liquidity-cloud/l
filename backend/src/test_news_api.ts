
const API_URL = 'http://localhost:3001/api/news';

const runTests = async () => {
    try {
        console.log('Starting News API Tests (using fetch)...');

        console.log('1. GET /api/news');
        const initialRes = await fetch(API_URL);
        const initialData = await initialRes.json();
        console.log(`- Status: ${initialRes.status}, Count: ${Array.isArray(initialData) ? initialData.length : 'Error'}`);

        console.log('2. POST /api/news');
        const newNews = {
            title: 'Test News',
            summary: 'Test Summary',
            content: 'Test Content',
            thumbnail: 'http://example.com/image.jpg',
            categoryId: 'NC_PROD'
        };
        const createRes = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNews)
        });
        const createData: any = await createRes.json();
        console.log(`- Status: ${createRes.status}, ID: ${createData.news_id}`);
        const createdId = createData.news_id;

        if (!createdId) throw new Error('Failed to create news, no ID returned');

        console.log(`3. PUT /api/news/${createdId}`);
        const updateNews = {
            ...newNews,
            title: 'Updated Test News'
        };
        const updateRes = await fetch(`${API_URL}/${createdId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateNews)
        });
        const updateData: any = await updateRes.json();
        console.log(`- Status: ${updateRes.status}, Title: ${updateData.news_title}`);

        console.log('4. GET /api/news');
        const afterCreateRes = await fetch(API_URL);
        const afterCreateData = await afterCreateRes.json();
        console.log(`- Status: ${afterCreateRes.status}, Count: ${Array.isArray(afterCreateData) ? afterCreateData.length : 'Error'}`);

        console.log(`5. DELETE /api/news/${createdId}`);
        const deleteRes = await fetch(`${API_URL}/${createdId}`, {
            method: 'DELETE'
        });
        console.log(`- Status: ${deleteRes.status}`);

        console.log('6. GET /api/news');
        const finalRes = await fetch(API_URL);
        const finalData = await finalRes.json();
        console.log(`- Status: ${finalRes.status}, Count: ${Array.isArray(finalData) ? finalData.length : 'Error'}`);

        console.log('Tests Completed Successfully.');

    } catch (error: any) {
        console.error('Test Failed:', error.message);
    }
};

runTests();
