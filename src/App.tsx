/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  GraduationCap, 
  Layout, 
  Lock, 
  Menu, 
  PlayCircle, 
  ShieldAlert, 
  Trophy,
  X,
  ArrowRight,
  Terminal,
  Cpu,
  Fingerprint,
  Globe,
  MousePointer2,
  Puzzle,
  Zap,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { courseData, finalExam, Module } from './courseData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [quizScores, setQuizScores] = useState<Record<number, number>>({});
  const [showFinalExam, setShowFinalExam] = useState(false);
  const [finalExamScore, setFinalExamScore] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeModule = courseData.find(m => m.id === activeModuleId) || courseData[0];
  const progress = (completedModules.length / courseData.length) * 100;

  const handleCompleteModule = (id: number) => {
    if (!completedModules.includes(id)) {
      setCompletedModules([...completedModules, id]);
    }
  };

  const isModuleUnlocked = (id: number) => {
    if (id === 1) return true;
    return completedModules.includes(id - 1);
  };

  const getModuleIcon = (id: number) => {
    const icons = [
      <Layout className="w-4 h-4" />,
      <Terminal className="w-4 h-4" />,
      <Fingerprint className="w-4 h-4" />,
      <Globe className="w-4 h-4" />,
      <MousePointer2 className="w-4 h-4" />,
      <Puzzle className="w-4 h-4" />,
      <Zap className="w-4 h-4" />,
      <Cpu className="w-4 h-4" />,
      <ShieldCheck className="w-4 h-4" />,
      <Scale className="w-4 h-4" />
    ];
    return icons[id - 1] || <BookOpen className="w-4 h-4" />;
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-80 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col z-20"
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShieldAlert className="w-6 h-6 text-primary neon-glow" />
                </div>
                <h1 className="text-lg font-bold leading-tight uppercase tracking-tighter">
                  Stealth & <br /> Automation
                </h1>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  <span>Course Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                {courseData.map((module) => {
                  const unlocked = isModuleUnlocked(module.id);
                  const active = activeModuleId === module.id;
                  const completed = completedModules.includes(module.id);

                  return (
                    <button
                      key={module.id}
                      disabled={!unlocked}
                      onClick={() => {
                        setActiveModuleId(module.id);
                        setShowFinalExam(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-all flex items-start gap-3 group relative ${
                        active 
                          ? 'bg-primary/10 border border-primary/30' 
                          : unlocked 
                            ? 'hover:bg-secondary/50 border border-transparent' 
                            : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className={`mt-1 ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                        {completed ? <CheckCircle2 className="w-4 h-4 text-primary" /> : getModuleIcon(module.id)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">Module {module.id}</span>
                          {!unlocked && <Lock className="w-3 h-3 text-muted-foreground" />}
                        </div>
                        <h3 className={`text-sm font-medium truncate ${active ? 'text-primary' : ''}`}>
                          {module.title}
                        </h3>
                      </div>
                      {active && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"
                        />
                      )}
                    </button>
                  );
                })}

                <Separator className="my-4" />

                <button
                  disabled={completedModules.length < courseData.length}
                  onClick={() => setShowFinalExam(true)}
                  className={`w-full text-left p-4 rounded-lg transition-all flex items-center gap-3 border-2 ${
                    showFinalExam 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : completedModules.length === courseData.length
                        ? 'bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary'
                        : 'bg-secondary/20 border-border opacity-50 cursor-not-allowed'
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold uppercase tracking-tight">Final Examination</h3>
                    {completedModules.length < courseData.length && (
                      <p className="text-[10px] opacity-70">Complete all modules to unlock</p>
                    )}
                  </div>
                </button>
              </div>
            </ScrollArea>
          </div>

          <div className="p-4 border-t border-border bg-background/50">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">STUDENT_0x42</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Advanced Security Track</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/30 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:text-primary"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                {showFinalExam ? 'Certification Phase' : `Module ${activeModule.id}`}
              </span>
              <h2 className="text-sm font-bold tracking-tight">
                {showFinalExam ? 'Final Comprehensive Exam' : activeModule.title}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono text-[10px] border-primary/30 text-primary">
              SYSTEM_STATUS: ACTIVE
            </Badge>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="max-w-4xl mx-auto p-8 pb-24">
              <AnimatePresence mode="wait">
                {showFinalExam ? (
                  <FinalExamView 
                    onComplete={(score) => setFinalExamScore(score)} 
                    score={finalExamScore}
                  />
                ) : (
                  <ModuleView 
                    key={activeModule.id}
                    module={activeModule} 
                    onComplete={() => handleCompleteModule(activeModule.id)}
                    isCompleted={completedModules.includes(activeModule.id)}
                  />
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}

function GlossaryTerm({ term, definition }: { term: string, definition: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-primary border-b border-dashed border-primary/50 hover:border-primary transition-colors cursor-help font-medium"
      >
        {term}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-card border border-primary/30 rounded-lg shadow-xl text-xs font-sans normal-case leading-relaxed text-foreground"
          >
            <span className="block font-bold text-primary mb-1 uppercase tracking-tighter">Definition</span>
            {definition}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-primary/30 rotate-45" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function DeepDive({ title, content }: { title: string, content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="my-6 border border-primary/20 rounded-lg bg-primary/5 overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-primary/10 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-md">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-sm uppercase tracking-tight">{title}</span>
        </div>
        <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-primary/10 text-sm text-muted-foreground leading-relaxed">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModuleView({ module, onComplete, isCompleted }: { module: Module, onComplete: () => void, isCompleted: boolean }) {
  const [activeTab, setActiveTab] = useState('content');
  const [assignmentInput, setAssignmentInput] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  const handleSubmitAssignment = () => {
    if (!assignmentInput.trim()) return;
    
    setSubmissionMessage('Assignment submitted for review.');
    setAssignmentInput('');
    
    setTimeout(() => {
      setSubmissionMessage('');
    }, 3000);
  };

  const markdownComponents = {
    a: ({ href, children }: any) => {
      if (href?.startsWith('glossary://')) {
        const definition = decodeURIComponent(href.replace('glossary://', ''));
        return <GlossaryTerm term={String(children)} definition={definition} />;
      }
      if (href?.startsWith('deepdive://')) {
        const content = decodeURIComponent(href.replace('deepdive://', ''));
        return <DeepDive title={String(children)} content={content} />;
      }
      return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{children}</a>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tighter leading-none">
            {module.title}
          </h1>
          {isCompleted && (
            <Badge className="bg-primary text-primary-foreground flex gap-1 items-center px-3 py-1">
              <CheckCircle2 className="w-3 h-3" /> COMPLETED
            </Badge>
          )}
        </div>
        <p className="text-xl text-muted-foreground font-light">
          {module.description}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-border p-1 h-12">
          <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookOpen className="w-4 h-4 mr-2" /> Lecture
          </TabsTrigger>
          <TabsTrigger value="quiz" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Puzzle className="w-4 h-4 mr-2" /> Quiz
          </TabsTrigger>
          <TabsTrigger value="assignment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Terminal className="w-4 h-4 mr-2" /> Assignment
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="content" className="mt-0">
            <Card className="border-border bg-card/30 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8 prose prose-invert max-w-none">
                <div className="markdown-body">
                  <ReactMarkdown components={markdownComponents}>{module.content}</ReactMarkdown>
                </div>
              </CardContent>
              <CardFooter className="bg-secondary/20 p-6 flex justify-between items-center border-t border-border">
                <p className="text-sm text-muted-foreground italic">
                  Read the lecture material thoroughly before attempting the quiz.
                </p>
                <Button onClick={() => setActiveTab('quiz')} className="group">
                  Next: Take Quiz <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="mt-0">
            <QuizView 
              questions={module.quiz} 
              onPass={() => {
                if (!isCompleted) onComplete();
                setActiveTab('assignment');
              }} 
            />
          </TabsContent>

          <TabsContent value="assignment" className="mt-0">
            <Card className="border-border bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-primary" />
                  Practical Assignment
                </CardTitle>
                <CardDescription>
                  Apply the concepts learned in this module to a real-world scenario.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="p-6 bg-background/50 border border-border rounded-lg font-mono text-sm leading-relaxed">
                  {module.assignment}
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Submission Terminal</h4>
                  <textarea 
                    className="w-full h-48 bg-black/50 border border-border rounded-lg p-4 font-mono text-sm text-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                    placeholder="Enter your findings or code snippet here..."
                    value={assignmentInput}
                    onChange={(e) => setAssignmentInput(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="p-6 border-t border-border flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-xs text-muted-foreground">
                  * In a real university course, this would be reviewed by a TA.
                </p>
                <AnimatePresence>
                  {submissionMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-primary font-bold mt-1"
                    >
                      {submissionMessage}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <Button 
                onClick={handleSubmitAssignment}
                disabled={!assignmentInput.trim()}
                variant="outline" 
                className="border-primary/50 text-primary hover:bg-primary/10"
              >
                Submit for Review
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  </motion.div>
);
}

function QuizView({ questions, onPass }: { questions: any[], onPass: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    const finalScore = (correct / questions.length) * 100;
    setScore(finalScore);
    setSubmitted(true);
    if (finalScore >= 70) {
      onPass();
    }
  };

  return (
    <Card className="border-border bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-primary" />
          Module Assessment
        </CardTitle>
        <CardDescription>
          Pass with 70% or higher to unlock the next module.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {questions.map((q, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">
              <span className="text-primary font-mono mr-2">{i + 1}.</span>
              {q.question}
            </h3>
            <div className="grid gap-3">
              {q.options.map((opt: string, optIdx: number) => (
                <button
                  key={optIdx}
                  disabled={submitted}
                  onClick={() => setAnswers({ ...answers, [i]: optIdx })}
                  className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between ${
                    answers[i] === optIdx 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border bg-background/50 hover:border-primary/50'
                  } ${
                    submitted && optIdx === q.correctAnswer ? 'border-green-500 bg-green-500/10 text-green-500' : ''
                  } ${
                    submitted && answers[i] === optIdx && optIdx !== q.correctAnswer ? 'border-red-500 bg-red-500/10 text-red-500' : ''
                  }`}
                >
                  <span>{opt}</span>
                  {submitted && optIdx === q.correctAnswer && <CheckCircle2 className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="p-6 border-t border-border flex justify-between items-center">
        {submitted ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase">Result</span>
              <span className={`text-xl font-bold ${score >= 70 ? 'text-green-500' : 'text-red-500'}`}>
                {score}% {score >= 70 ? 'PASSED' : 'FAILED'}
              </span>
            </div>
            {score < 70 && (
              <Button onClick={() => { setSubmitted(false); setAnswers({}); }} variant="outline">
                Retry Quiz
              </Button>
            )}
          </div>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={Object.keys(answers).length < questions.length}
            className="w-full sm:w-auto"
          >
            Submit Assessment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function FinalExamView({ onComplete, score }: { onComplete: (score: number) => void, score: number | null }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(score !== null);

  const handleSubmit = () => {
    let correct = 0;
    finalExam.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    const finalScore = (correct / finalExam.length) * 100;
    onComplete(finalScore);
    setSubmitted(true);
  };

  if (score !== null && score >= 80) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8 py-12"
      >
        <div className="relative inline-block">
          <Trophy className="w-32 h-32 text-primary mx-auto neon-glow" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-full"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tighter uppercase">Certification Granted</h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Congratulations. You have successfully completed the Advanced Stealth & Automation track with a score of <span className="text-primary font-bold">{score}%</span>.
          </p>
        </div>
        <Card className="max-w-2xl mx-auto border-2 border-primary bg-black technical-grid p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldAlert className="w-32 h-32" />
          </div>
          <div className="space-y-8 relative z-10">
            <div className="flex justify-between items-start">
              <div className="text-left">
                <p className="text-[10px] font-mono text-primary uppercase tracking-widest">Certificate of Completion</p>
                <h2 className="text-2xl font-bold uppercase tracking-tight">Advanced Web Stealth</h2>
              </div>
              <Badge className="bg-primary text-primary-foreground">LEVEL_10_CERTIFIED</Badge>
            </div>
            <Separator className="bg-primary/30" />
            <div className="py-8">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Issued to</p>
              <p className="text-4xl font-mono font-bold text-primary neon-glow">STUDENT_0x42</p>
            </div>
            <div className="flex justify-between items-end text-left">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Verification ID</p>
                <p className="text-xs font-mono">AIS-SEC-2026-BRL-001</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase">Date</p>
                <p className="text-xs font-mono">APRIL 08, 2026</p>
              </div>
            </div>
          </div>
        </Card>
        <Button size="lg" className="px-8 h-14 text-lg font-bold uppercase tracking-widest">
          Download Credentials
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tighter uppercase">Final Examination</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          This comprehensive exam covers all 10 modules. You must achieve a score of 80% or higher to receive your certification.
        </p>
      </div>

      <Card className="border-border bg-card/30 backdrop-blur-sm">
        <CardContent className="p-8 space-y-12">
          {finalExam.map((q, i) => (
            <div key={i} className="space-y-6">
              <h3 className="text-xl font-medium">
                <span className="text-primary font-mono mr-3">{i + 1}.</span>
                {q.question}
              </h3>
              <div className="grid gap-4">
                {q.options.map((opt: string, optIdx: number) => (
                  <button
                    key={optIdx}
                    disabled={submitted}
                    onClick={() => setAnswers({ ...answers, [i]: optIdx })}
                    className={`w-full text-left p-5 rounded-lg border transition-all flex items-center justify-between ${
                      answers[i] === optIdx 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border bg-background/50 hover:border-primary/50'
                    } ${
                      submitted && optIdx === q.correctAnswer ? 'border-green-500 bg-green-500/10 text-green-500' : ''
                    } ${
                      submitted && answers[i] === optIdx && optIdx !== q.correctAnswer ? 'border-red-500 bg-red-500/10 text-red-500' : ''
                    }`}
                  >
                    <span>{opt}</span>
                    {submitted && optIdx === q.correctAnswer && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="p-8 border-t border-border flex flex-col gap-6">
          {!submitted ? (
            <Button 
              onClick={handleSubmit} 
              disabled={Object.keys(answers).length < finalExam.length}
              size="lg"
              className="w-full h-16 text-xl font-bold uppercase tracking-widest"
            >
              Submit Final Exam
            </Button>
          ) : (
            <div className="text-center space-y-6 w-full">
              <div className="inline-block p-8 rounded-2xl bg-secondary/30 border border-border">
                <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Final Score</p>
                <h2 className={`text-6xl font-bold ${score! >= 80 ? 'text-green-500' : 'text-red-500'}`}>
                  {score}%
                </h2>
                <p className="mt-4 text-lg font-medium">
                  {score! >= 80 ? 'EXAMINATION PASSED' : 'EXAMINATION FAILED'}
                </p>
              </div>
              {score! < 80 && (
                <div className="space-y-4">
                  <p className="text-muted-foreground">You did not reach the 80% threshold required for certification.</p>
                  <Button onClick={() => { setSubmitted(false); setAnswers({}); onComplete(0); }} variant="outline" size="lg">
                    Retake Final Exam
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
