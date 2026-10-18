"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  Menu,
  Search,
  CalendarDays,
  Bell,
  ChevronDown,
  ArrowRight,
  LoaderCircle,
  ReceiptText,
  X,
  CheckCheck,
  Inbox,
} from "lucide-react";

export type GlobalSearchResult = {
  name: string;
  email: string;
  order: string;
  product: string;
  amount: number;
  status: string;
  date: string;
  period: "7" | "30" | "90";
  onPeriodChange: (period: "7" | "30" | "90") => void;
};

type TopbarProps = {
  darkMode: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  searchResults?: GlobalSearchResult[];
  searchLoading?: boolean;
  searchError?: boolean;
  onSelectResult?: (result: GlobalSearchResult) => void;
  period: "7" | "30" | "90";
  onPeriodChange: Dispatch<SetStateAction<"7" | "30" | "90">>;
};

export default function Topbar({
  darkMode,
  setMobileMenuOpen,
  search,
  setSearch,
  searchResults = [],
  searchLoading = false,
  searchError = false,
  onSelectResult,
  period,
  onPeriodChange,
}: TopbarProps) {
  // const [period, setPeriod] = useState("Last 30 days");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [activeIndex, setActiveIndex] = useState(-1);

  const listboxId = useId();

  const resultRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const mobileInputRef = useRef<HTMLInputElement>(null);
  const mobileDialogRef = useRef<HTMLDivElement>(null);
  const mobileSearchButtonRef = useRef<HTMLButtonElement>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setActiveIndex(-1);
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setIsSearchOpen(true);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const hasQuery = search.trim().length > 0;
  const visibleResults = searchResults.slice(0, 5);

  const selectResult = (result: GlobalSearchResult) => {
    onSelectResult?.(result);
    setActiveIndex(-1);
    setIsSearchOpen(false);
  };

  useEffect(() => {
    if (activeIndex >= 0) {
      resultRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    if (!isMobileSearchOpen) return;

    mobileInputRef.current?.focus();
    // 👇 Capture the button node when the effect runs
    const triggerButton = mobileSearchButtonRef.current;

    function handleMobileKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMobileSearchOpen(false);
        setIsSearchOpen(false);
        setActiveIndex(-1);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements =
        mobileDialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        );

      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (
        event.shiftKey &&
        (activeElement === firstElement ||
          !mobileDialogRef.current?.contains(activeElement))
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        (activeElement === lastElement ||
          !mobileDialogRef.current?.contains(activeElement))
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleMobileKeyDown);

    return () => {
      document.removeEventListener("keydown", handleMobileKeyDown);

      // Return focus to the button that opened the overlay.
      if (isMobileSearchOpen) {
        triggerButton?.focus();
      }
    };
  }, [isMobileSearchOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-30 flex h-18 items-center justify-between gap-3 border-b px-4 sm:px-6 ${
          darkMode
            ? "border-slate-800 bg-slate-950 text-slate-100"
            : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>
          <button
            ref={mobileSearchButtonRef}
            type="button"
            onClick={() => {
              setIsMobileSearchOpen(true);
              setActiveIndex(-1);
            }}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 sm:hidden"
            aria-label="Open global search"
          >
            <Search size={21} />
          </button>
          <div
            ref={searchContainerRef}
            className="relative hidden w-full max-w-md sm:block"
          >
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              ref={inputRef}
              value={search}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(event) => {
                setSearch(event.target.value);
                setActiveIndex(-1);
                setIsSearchOpen(true);
              }}
              placeholder="Search transactions, customers, orders..."
              className={`w-full rounded-lg border py-2.5 pl-10 pr-20 text-sm outline-none transition ${
                darkMode
                  ? "border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400"
                  : "border-transparent bg-slate-100 text-slate-900 placeholder:text-slate-500 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              }`}
              aria-expanded={isSearchOpen && hasQuery}
              aria-controls={listboxId}
              aria-activedescendant={
                isSearchOpen && activeIndex >= 0
                  ? `${listboxId}-option-${activeIndex}`
                  : undefined
              }
              aria-autocomplete="list"
              role="combobox"
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setIsSearchOpen(true);

                  if (visibleResults.length > 0) {
                    setActiveIndex((current) =>
                      current >= visibleResults.length - 1 ? 0 : current + 1,
                    );
                  }
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setIsSearchOpen(true);

                  if (visibleResults.length > 0) {
                    setActiveIndex((current) =>
                      current <= 0 ? visibleResults.length - 1 : current - 1,
                    );
                  }
                } else if (event.key === "Enter") {
                  if (
                    isSearchOpen &&
                    activeIndex >= 0 &&
                    activeIndex < visibleResults.length
                  ) {
                    event.preventDefault();
                    selectResult(visibleResults[activeIndex]);
                  }
                } else if (event.key === "Escape") {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsSearchOpen(false);
                  setActiveIndex(-1);
                }
              }}
            />

            {hasQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveIndex(-1);
                  setIsSearchOpen(true);
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                aria-label="Clear global search"
              >
                <X size={15} />
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 md:block">
                Ctrl K
              </span>
            )}

            {isSearchOpen && hasQuery && (
              <div
                id={listboxId}
                role="listbox"
                className={`absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border shadow-xl ${
                  darkMode
                    ? "border-slate-700 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Transactions
                  </span>
                  {searchLoading && (
                    <LoaderCircle
                      size={15}
                      className="animate-spin text-indigo-500"
                      aria-label="Loading results"
                    />
                  )}
                </div>

                {searchLoading && searchResults.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-500">
                    Searching transactions...
                  </div>
                ) : searchError ? (
                  <div className="px-4 py-6 text-center text-sm text-red-500">
                    Could not load results. Please try again.
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <Search size={22} className="mx-auto mb-2 text-slate-400" />
                    <p className="text-sm font-medium">No results found</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Try a name, email, order ID, or product.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto py-1">
                    {visibleResults.map((result, index) => {
                      const isActive = index === activeIndex;

                      return (
                        <button
                          key={result.order}
                          id={`${listboxId}-option-${index}`}
                          ref={(element) => {
                            resultRefs.current[index] = element;
                          }}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => selectResult(result)}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                            isActive
                              ? darkMode
                                ? "bg-slate-800"
                                : "bg-indigo-50"
                              : darkMode
                                ? "hover:bg-slate-800"
                                : "hover:bg-slate-50"
                          }`}
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                            <ReceiptText size={17} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">
                              {result.name}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-slate-500">
                              {result.order} · {result.product}
                            </span>
                          </span>

                          <span className="shrink-0 text-right">
                            <span className="block text-sm font-medium">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 2,
                              }).format(result.amount)}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500">
                              {result.status}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-700">
                  <span>Search across transactions</span>
                  <span className="flex items-center gap-1">
                    View results <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 sm:px-3 sm:text-sm">
            <CalendarDays size={16} className="text-slate-500" />
            <select
              value={period}
              onChange={(event) =>
                onPeriodChange(event.target.value as "7" | "30" | "90")
              }
              className="max-w-24 bg-transparent outline-none sm:max-w-none"
              aria-label="Select reporting period"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </label>

          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={isNotificationsOpen}
              onClick={() => setIsNotificationsOpen((open) => !open)}
              className={`relative rounded-xl border p-2.5 transition ${
                darkMode
                  ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                  : "border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Bell size={19} />
            </button>

            {isNotificationsOpen && (
              <div
                className={`absolute right-0 top-full z-50 mt-3 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border shadow-xl ${
                  darkMode
                    ? "border-slate-700 bg-slate-900 text-slate-100"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-700">
                  <div>
                    <h3 className="font-semibold">Notifications</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Updates from your workspace
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsNotificationsOpen(false)}
                    aria-label="Close notifications"
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X size={17} />
                  </button>
                </div>

                <div className="px-6 py-9 text-center">
                  <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
                      darkMode ? "bg-slate-800" : "bg-indigo-50"
                    }`}
                  >
                    <Inbox size={26} className="text-indigo-500" />
                  </div>

                  <h4 className="text-sm font-semibold">
                    You`&apos;`re all caught up!
                  </h4>

                  <p className="mx-auto mt-2 max-w-60 text-xs leading-5 text-slate-500">
                    You don`&apos;`t have any notifications right now.
                    We`&apos;`ll let you know when something needs your
                    attention.
                  </p>

                  <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCheck size={14} />
                    All caught up
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
              JD
            </div>
            <span className="text-sm font-medium">John Doe</span>
            <ChevronDown size={15} />
          </div>
        </div>
      </header>
      {isMobileSearchOpen && (
        <div
          ref={mobileDialogRef}
          className="fixed inset-0 z-100 bg-white text-slate-900 sm:hidden dark:bg-slate-950 dark:text-slate-100"
          role="dialog"
          aria-modal="true"
          aria-label="Global search"
        >
          <div className="flex items-center gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
            <Search size={20} className="shrink-0 text-slate-400" />

            <input
              ref={mobileInputRef}
              value={search}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(event) => {
                setSearch(event.target.value);
                setActiveIndex(-1);
                setIsSearchOpen(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setIsSearchOpen(true);

                  if (visibleResults.length > 0) {
                    setActiveIndex((current) =>
                      current >= visibleResults.length - 1 ? 0 : current + 1,
                    );
                  }
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setIsSearchOpen(true);

                  if (visibleResults.length > 0) {
                    setActiveIndex((current) =>
                      current <= 0 ? visibleResults.length - 1 : current - 1,
                    );
                  }
                } else if (event.key === "Enter") {
                  if (activeIndex >= 0 && activeIndex < visibleResults.length) {
                    event.preventDefault();
                    selectResult(visibleResults[activeIndex]);
                    setIsMobileSearchOpen(false);
                  }
                } else if (event.key === "Escape") {
                  event.preventDefault();
                  setIsMobileSearchOpen(false);
                  setIsSearchOpen(false);
                  setActiveIndex(-1);
                }
              }}
              placeholder="Search transactions..."
              className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-slate-400"
              aria-label="Search transactions"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={isSearchOpen && hasQuery}
              aria-controls={listboxId}
              aria-activedescendant={
                isSearchOpen && activeIndex >= 0
                  ? `${listboxId}-option-${activeIndex}`
                  : undefined
              }
            />

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveIndex(-1);
                setIsSearchOpen(true);
                mobileInputRef.current?.focus();
              }}
              className="rounded-lg px-2 py-2 text-sm text-slate-500"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen(false);
                setIsSearchOpen(false);
                setActiveIndex(-1);
              }}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>

          <div className="max-h-[calc(100dvh-80px)] overflow-y-auto">
            {!hasQuery ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">
                Search by customer, email, order ID, or product.
              </p>
            ) : searchLoading && visibleResults.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">
                Searching transactions...
              </p>
            ) : searchError ? (
              <p className="px-4 py-8 text-center text-sm text-red-500">
                Could not load results. Please try again.
              </p>
            ) : visibleResults.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">
                No results found.
              </p>
            ) : (
              <div id={`${listboxId}-mobile`} className="py-2">
                {visibleResults.map((result, index) => (
                  <button
                    key={result.order}
                    type="button"
                    onClick={() => {
                      selectResult(result);
                      setIsMobileSearchOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-4 text-left ${
                      index === activeIndex
                        ? "bg-indigo-50 dark:bg-slate-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <ReceiptText
                      size={20}
                      className="shrink-0 text-indigo-600"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {result.name}
                      </span>
                      <span className="mt-1 block truncate text-xs text-slate-500">
                        {result.order} · {result.product}
                      </span>
                    </span>

                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-medium">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 2,
                        }).format(result.amount)}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {result.status}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
