import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { X, Paperclip, Send, Sparkles, FileText } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../ui/dialog";
import { Textarea } from "../ui/textarea";

const ComposeAndSend = () => {
  const { selectedEmails } = useAppStore();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(""); // Stores HTML content from the editor
  const [attachments, setAttachments] = useState([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);

  const {askAI, isAskingAi, aiResponse, triggerNotification} = useAppStore()

  const handleGenerateWithAI = async () => {
    
    try {
      await askAI(aiPrompt);
      setSubject(aiResponse.subject)
      setBody(aiResponse.body);
      setIsAiModalOpen(false);

    } catch (error) {
      console.log(error.response)
      triggerNotification(error.response?.data?.message, "error")
    }

  };

  const handleSendEmail = async () => {
    const plainTextBody = new DOMParser().parseFromString(body, 'text/html').body.textContent || "";
    if (selectedEmails.length === 0 || !subject || !plainTextBody.trim()) {
      alert("Please select recipients, and provide a subject and body.");
      return;
    }
    setIsSending(true);

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('body', body); // Send the full HTML content
    formData.append('recipients', JSON.stringify(selectedEmails));
    if (attachment) {
      formData.append('attachment', attachment);
    }

    console.log("--- Sending Email Data (HTML Body) ---");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      alert(`Email successfully dispatched to ${selectedEmails.length} recipients! (Mock API)`);
      setSubject("");
      setBody("");
      setAttachment(null);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("An error occurred while sending the email.");
    } finally {
      setIsSending(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <>
      <Card className="h-full flex flex-col shadow-md border-blue-100">

        {/* ----------- Top Text --------- */}
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <span className="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-blue-500 text-white">3</span>
            <span className="text-blue-900">Compose & Send</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Write your email, use AI for assistance, and send it.</CardDescription>
        </CardHeader>


        <CardContent className="flex-grow flex flex-col gap-4">
          
          {/* ------------ Ask AI button */}
          <div className="space-y-1">
          <Button
          size="sm"
          onClick={() => setIsAiModalOpen(true)}
          className="bg-gradient-to-r from-blue-900 via-indigo-700 to-purple-900 text-white hover:from-blue-800 hover:via-indigo-600 hover:to-purple-800 border-0 hover:shadow-lg transition-all duration-300 rounded-full"
        >
          <Sparkles className="mr-2 h-4 w-4 text-white" />
          Generate with AI
        </Button>
          </div>

          {/* -------------- subject */}
          <div className="space-y-1">
            <label htmlFor="subject" className="text-sm font-medium text-blue-900">Subject</label>
            <Input id="subject" placeholder="Your email subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="border-blue-200"/>
          </div>

          {/* ----------- Text Editor */}
          <div className="space-y-1 flex-grow flex flex-col">
            <label className="text-sm font-medium text-blue-900">Body</label>
            
            {/* Quill text editor The wrapper div is the key change for robust styling */}
            <div className="quill-container-wrapper flex-grow h-[250px] rounded-md border border-blue-200 bg-white"
            spellCheck="false">

              <ReactQuill
                theme="snow"
                value={body}
                onChange={(value) => setBody(value)}
                modules={quillModules}
                placeholder="Write your email content here..."
                style={{ height: 'calc(100% - 42px)' }} // Adjust height to fit within the wrapper
              />
              
            </div>
          </div>
        </CardContent>

        {/*-------------- Footer  -------------- */}
        <CardFooter className="flex justify-between items-center border-t border-blue-100 pt-4">
          
          {/*-------------- Paper clip icon */}          
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <label htmlFor="attachment-input" className="cursor-pointer text-gray-500 hover:text-blue-600">
                <Paperclip className="h-5 w-5" />
              </label>
            </Button>

            <input
              id="attachment-input"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setAttachments((prev) => [...prev, ...Array.from(e.target.files)])}
            />

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-all"
                  >
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="truncate max-w-[100px]">{file.name}</span>
                    <button onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== index))}>
                      <X className="h-4 w-4 text-gray-500 hover:text-red-500 transition-all" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
            {/*-------------- Send Emails button */}        
          <Button onClick={handleSendEmail} disabled={isSending || selectedEmails.length === 0} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Send className="mr-2 h-4 w-4" />
            {isSending ? "Sending..." : `Send to ${selectedEmails.length} recipients`}
          </Button>
        </CardFooter>
      </Card>

      {/* ask AI to write Modal */}
      <Dialog open={isAiModalOpen } onOpenChange={setIsAiModalOpen} >
        <DialogContent>
          
          {/* Headings  */}
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-blue-900 via-purple-900 to-purple-900 bg-clip-text text-transparent font-semibold">Generate Email with AI</DialogTitle>
            <DialogDescription>
              Describe the purpose of your email, and our AI will draft it for you
            </DialogDescription>
          </DialogHeader>

          {/* Text block */}
          <div className="py-4">
            <Textarea
              placeholder="e.g., A welcome email for new subscribers..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="min-h-[100px] max-h-[250px] border-blue-200 "
              spellCheck="false"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>

            <Button onClick={handleGenerateWithAI} className="bg-gradient-to-r from-blue-900 via-indigo-700 to-purple-900 text-white hover:from-blue-800 hover:via-indigo-600 hover:to-purple-800 border-0 hover:shadow-lg transition-all duration-300 rounded-full">
               <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
};

export default ComposeAndSend;