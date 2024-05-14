// Import vital modules
const { SupabaseVectorStore } = require("@langchain/community/vectorstores/supabase");
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const { GoogleVertexAIMultimodalEmbeddings } = require("langchain/experimental/multimodal_embeddings/googlevertexai");
const fs = require('fs').promises;
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

// get the environment value
dotenv.config();

// create client interfere for the supabase vector db
const supabaseUrl = process.env.SUPERBASE_URL_LC_CHATBOT;
const supabaseKey = process.env.SUPERBASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


// create embeddings belonging Google Vertex AI
const embed = new GoogleVertexAIMultimodalEmbeddings();

// Retrievial functions
async function performRetrieval(query) {
    try {
        // Text source file
        const text = await fs.readFile('./3000words.txt', 'utf-8');

        // src splitter configuration
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            separators: ['\n\n', '\n', ' ', ''],
            chunkOverlap: 50,
        });

        // Split text into chunks
        const output = await splitter.createDocuments([text]);

        // Create and store vector 
        const vectorStore = await SupabaseVectorStore.fromDocuments(
            output,
            embed,
            {
                client: supabase,
                tableName: 'documents',
            }
        );


        // using the vector similarity search function from the vector db
        const results = await vectorStore.similaritySearch(query, 1);

        // print result of the vector db
        console.log(results);

    } catch (err) {
        console.error('Error', err);
    }
}

// Gọi hàm performRetrieval với truy vấn mẫu
performRetrieval('Strain Isolation and Screening');
