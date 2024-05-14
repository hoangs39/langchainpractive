const fs = require('fs').promises; // Importing file system module
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const dotenv = require("dotenv")
const { SupabaseVectorStore } = require("@langchain/community/vectorstores/supabase");
const { OpenAIEmbeddings } = require("@langchain/openai");
dotenv.config()
const { createClient } = require("@supabase/supabase-js")
const supabaseUrl = process.env.SUPERBASE_URL_LC_CHATBOT
const supabaseKey = process.env.SUPERBASE_API_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
const openaikey = process.env.OPENAI_API_KEY
async function splitText() {
  try {
    // Read the text file
    const text = await fs.readFile('./3000words.txt', 'utf-8');

    // Initialize the text splitter
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      separators: ['\n\n', '\n', ' ', ''],
      chunkOverlap: 50,
    });

    // Split the text into documents
    const output = await splitter.createDocuments([text])
    // Handle the output (either await or use .then())
    // Example: const processedText = await output;
    // output.then(processedText => console.log(processedText));
    const vectorStore = await SupabaseVectorStore.fromDocuments(
      output,
      new OpenAIEmbeddings({openAIApiKey}),
      {
        supabase,
        tableName: "documents",
      }
    );



  } catch (err) {
    console.log(err);
  }
}

splitText();


